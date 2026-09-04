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
for (const route of [
  "about",
  "services",
  "pricing",
  "blog",
  "contact",
  "privacy",
  "terms",
  "blog/admin",
  "blog/florida-permit-submittal-checklist",
  "blog/responding-to-florida-permit-review-comments",
  "blog/florida-notice-of-commencement-permitting",
  "services/permit-expediting",
  "services/commercial-permit-expediting",
  "services/residential-permit-expediting",
  "services/inspection-scheduling",
  "services/e-recording-notice-of-commencement",
  "services/multi-site-permit-coordination",
  "markets/florida-permit-expediting",
  "markets/orlando-permit-expediting",
  "markets/tampa-permit-expediting",
  "markets/palm-beach-permit-expediting",
]) {
  assert.ok(
    artifact.includes(`from = "/${route}"\nto = "/${route}/index.html"`),
    `Missing production rewrite for /${route}`,
  );
}
assert.match(nginx, /services\(\?:\/\(\?:permit-expediting/);
assert.match(nginx, /markets\/\(\?:florida-permit-expediting/);
console.log("Deployment redirect and 404 configuration verified.");