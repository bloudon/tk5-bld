import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import http from "node:http";
import os from "node:os";
import path from "node:path";

const workspace = path.resolve(import.meta.dirname, "../../..");
const publicDir = path.join(workspace, "artifacts/k5-website/dist/public");
const tempDir = await mkdtemp(path.join(os.tmpdir(), "k5-nginx-"));
const httpPort = 31881;
const httpsPort = 31882;
const siteSource = await readFile(path.join(workspace, "nginx.conf.example"), "utf8");

const siteConfig = siteSource
  .replace(/^\s*listen \[::\]:(?:80|443).*$/gm, "")
  .replaceAll("listen 80;", `listen 127.0.0.1:${httpPort};`)
  .replaceAll("listen 443 ssl http2;", `listen 127.0.0.1:${httpsPort};`)
  .replace(/^\s*ssl_certificate(?:_key)? .*$/gm, "")
  .replace("root /path/to/tk5-bld/artifacts/k5-website/dist/public;", `root ${publicDir};`)
  .replace("return 301 $scheme://$host/$1$is_args$args;", "return 301 https://$host/$1$is_args$args;");

const configPath = path.join(tempDir, "nginx.conf");
await writeFile(
  configPath,
  `worker_processes 1;
pid ${path.join(tempDir, "nginx.pid")};
error_log ${path.join(tempDir, "error.log")} notice;
events { worker_connections 64; }
http {
  access_log off;
  default_type text/html;
  ${siteConfig}
}
`,
);

function request(port, host, requestPath) {
  return new Promise((resolve, reject) => {
    const req = http.get(
      { hostname: "127.0.0.1", port, path: requestPath, headers: { Host: host } },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () =>
          resolve({ status: res.statusCode, location: res.headers.location, body }),
        );
      },
    );
    req.on("error", reject);
  });
}

const nginx = spawn("nginx", ["-p", tempDir, "-c", configPath, "-g", "daemon off;"], {
  stdio: ["ignore", "ignore", "pipe"],
});
let errors = "";
nginx.stderr.on("data", (chunk) => (errors += chunk.toString()));

try {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      await request(httpPort, "bldpermit.com", "/");
      break;
    } catch {
      if (attempt === 49) throw new Error(`Nginx did not start:\n${errors}`);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  const redirectPath = "/services?source=legacy";
  for (const host of [
    "bldpermit.com",
    "www.bldpermit.com",
    "expeditepermit.com",
    "www.expeditepermit.com",
  ]) {
    const response = await request(httpPort, host, redirectPath);
    assert.equal(response.status, 301);
    assert.equal(response.location, `https://bldpermit.com${redirectPath}`);
  }

  for (const host of ["www.bldpermit.com", "expeditepermit.com", "www.expeditepermit.com"]) {
    const response = await request(httpsPort, host, redirectPath);
    assert.equal(response.status, 301);
    assert.equal(response.location, `https://bldpermit.com${redirectPath}`);
  }

  const about = await request(httpsPort, "bldpermit.com", "/about");
  assert.equal(about.status, 200);
  assert.match(about.body, /<title>About Team K5 Construction &amp; Development Coordination<\/title>/);
  assert.match(about.body, /rel="canonical" href="https:\/\/bldpermit\.com\/about"/);

  const trailingSlash = await request(httpsPort, "bldpermit.com", "/about/?x=1");
  assert.equal(trailingSlash.status, 301);
  assert.equal(trailingSlash.location, "https://bldpermit.com/about?x=1");

  const missing = await request(httpsPort, "bldpermit.com", "/definitely-not-a-page");
  assert.equal(missing.status, 404);
  assert.match(missing.body, /404 Page Not Found/);
  assert.match(missing.body, /noindex, follow/);

  console.log("Nginx HTTP redirects, canonical route, and branded 404 verified.");
} finally {
  nginx.kill("SIGTERM");
  await once(nginx, "exit").catch(() => {});
  await rm(tempDir, { recursive: true, force: true });
}