import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../../..");
const nginx = await readFile(path.join(root, "nginx.conf.example"), "utf8");
const artifact = await readFile(
  path.join(root, "artifacts/k5-website/.replit-artifact/artifact.toml"),
  "utf8",
);

assert.match(
  nginx,
  /server_name bldpermit\.com www\.bldpermit\.com expeditepermit\.com www\.expeditepermit\.com;/,
);
assert.match(
  nginx,
  /server_name www\.bldpermit\.com expeditepermit\.com www\.expeditepermit\.com;/,
);
assert.equal((nginx.match(/return 301 https:\/\/bldpermit\.com\$request_uri;/g) ?? []).length, 2);
assert.doesNotMatch(nginx, /teamk5\.com/);
assert.match(nginx, /error_page 404 \/404\.html;/);
assert.match(nginx, /location \/api\//);
assert.doesNotMatch(artifact, /from = "\/\*"/);
for (const route of ["about", "services", "pricing", "blog", "contact"]) {
  assert.ok(
    artifact.includes(`from = "/${route}"\nto = "/${route}/index.html"`),
    `Missing production rewrite for /${route}`,
  );
}
console.log("Deployment redirect and 404 configuration verified.");