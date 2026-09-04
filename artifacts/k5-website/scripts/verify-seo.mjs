import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const routes = [
  { path: "/", title: "Permit Expediting & Coordination | Team K5 C&D", description: "Team K5 Construction & Development Coordination manages permit expediting, inspections, e-recording, and nationwide project coordination. Serving contractors since 2003." },
  { path: "/about", title: "About Team K5 Construction & Development Coordination", description: "Learn how Team K5 Construction & Development Coordination applies municipal experience to permit expediting and project coordination." },
  { path: "/services", title: "Permit Expediting and Coordination Services | Team K5 C&D", description: "Explore permit expediting, inspections, e-recording, notary, and coordination from Team K5 Construction & Development Coordination." },
  { path: "/pricing", title: "Permit Service Pricing and Project Quotes | Team K5 C&D", description: "Review pricing for permit expediting, inspections, e-recording, and coordination from Team K5 Construction & Development Coordination." },
  { path: "/blog", title: "Florida Permitting Insights | Team K5 C&D", description: "Florida permit guidance and construction coordination insights from Team K5 Construction & Development Coordination." },
  { path: "/contact", title: "Request Permit Expediting Services | Team K5 C&D", description: "Contact Team K5 Construction & Development Coordination about permit expediting, inspections, and project coordination." },
  { path: "/privacy", title: "Privacy Policy | Team K5 Construction & Development", description: "Learn how Team K5 Construction & Development Coordination collects, uses, protects, and manages contact and website analytics information." },
  { path: "/terms", title: "Website Terms | Team K5 Construction & Development", description: "Review the website terms for Team K5 Construction & Development Coordination, including informational content and acceptable use." },
  { path: "/blog/florida-permit-submittal-checklist", title: "Florida Building Permit Submittal Checklist | Team K5", description: "Use this practical Florida permit checklist to organize scope, drawings, product approvals, forms, and jurisdiction requirements before submission." },
  { path: "/blog/responding-to-florida-permit-review-comments", title: "Responding to Florida Permit Review Comments | Team K5", description: "Learn how a clear response matrix, coordinated revisions, and disciplined file control can reduce repeat Florida permit review cycles." },
  { path: "/blog/florida-notice-of-commencement-permitting", title: "Florida Notices of Commencement and Permits | Team K5", description: "Learn how Florida Notices of Commencement can intersect with permit and inspection workflows, recording, timing, and project records." },
];
const landingPaths = [
  "/services/permit-expediting",
  "/services/commercial-permit-expediting",
  "/services/residential-permit-expediting",
  "/services/inspection-scheduling",
  "/services/e-recording-notice-of-commencement",
  "/services/multi-site-permit-coordination",
  "/markets/florida-permit-expediting",
  "/markets/orlando-permit-expediting",
  "/markets/tampa-permit-expediting",
  "/markets/palm-beach-permit-expediting",
];

for (const route of routes) {
  const file = route.path === "/" ? "index.html" : `${route.path.slice(1)}/index.html`;
  const html = await readFile(path.join(root, "dist/public", file), "utf8");
  assert.ok(html.includes(`<title>${route.title.replaceAll("&", "&amp;")}</title>`));
  assert.ok(
    html.includes(
      `<meta name="description" content="${route.description.replaceAll("&", "&amp;").replaceAll('"', "&quot;")}" />`,
    ),
  );
  assert.match(html, new RegExp(`<link rel="canonical" href="https://bldpermit.com${route.path === "/" ? "" : route.path}"`));
  assert.match(html, /<meta property="og:image" content="https:\/\/bldpermit\.com\/og-image\.png"/);
  assert.match(html, /<meta name="twitter:image" content="https:\/\/bldpermit\.com\/og-image\.png"/);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${route.path} must contain exactly one H1`);
  assert.doesNotMatch(html, /<div id="root"><\/div>/);
  assert.match(html, /href="\/(?:about|services|pricing|blog|contact)?"/);
}

const landingTitles = new Set();
const landingDescriptions = new Set();
for (const routePath of landingPaths) {
  const html = await readFile(path.join(root, "dist/public", routePath.slice(1), "index.html"), "utf8");
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="(.*?)"\s*\/>/)?.[1];
  assert.ok(title && !landingTitles.has(title), `${routePath} must have a unique title`);
  assert.ok(description && !landingDescriptions.has(description), `${routePath} must have a unique description`);
  landingTitles.add(title);
  landingDescriptions.add(description);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${routePath} must contain exactly one H1`);
  assert.match(html, new RegExp(`<link rel="canonical" href="https://bldpermit.com${routePath}"`));
  assert.match(html, new RegExp(`<meta property="og:url" content="https://bldpermit.com${routePath}"`));
  assert.match(html, /<meta property="og:image" content="https:\/\/bldpermit\.com\/og-image\.png"/);
  assert.match(html, /<meta name="twitter:image" content="https:\/\/bldpermit\.com\/og-image\.png"/);
  assert.match(html, /Frequently asked questions/);
  assert.match(html, /How the work moves forward/);
}

const notFound = await readFile(path.join(root, "dist/public/404.html"), "utf8");
assert.match(notFound, /<meta name="robots" content="noindex, follow"/);
assert.match(notFound, /404 Page Not Found/);

const sitemap = await readFile(path.join(root, "dist/public/sitemap.xml"), "utf8");
assert.match(sitemap, /<sitemapindex/);
assert.match(sitemap, /https:\/\/bldpermit\.com\/sitemap-static\.xml/);
assert.match(sitemap, /https:\/\/bldpermit\.com\/api\/blog\/sitemap\.xml/);
assert.doesNotMatch(sitemap, /404|admin|expeditepermit|teamk5/);
const staticSitemap = await readFile(path.join(root, "dist/public/sitemap-static.xml"), "utf8");
assert.equal((staticSitemap.match(/<url>/g) ?? []).length, routes.length + landingPaths.length);
assert.match(staticSitemap, /\/blog\/florida-permit-submittal-checklist/);
for (const routePath of landingPaths) assert.match(staticSitemap, new RegExp(routePath));

const blog = await readFile(path.join(root, "dist/public/blog/index.html"), "utf8");
assert.match(blog, /<meta name="robots" content="index, follow"/);
assert.equal((blog.match(/<article/g) ?? []).length, 3);

const home = await readFile(path.join(root, "dist/public/index.html"), "utf8");
assert.match(home, /"@type":"Organization"/);
assert.match(home, /Team K5 Construction and Development Coordination, LLC/);
assert.match(home, /permitting@expeditepermit\.com/);
for (const slug of [
  "florida-permit-submittal-checklist",
  "responding-to-florida-permit-review-comments",
  "florida-notice-of-commencement-permitting",
]) {
  const article = await readFile(path.join(root, `dist/public/blog/${slug}/index.html`), "utf8");
  assert.match(article, /"@type":"Article"/);
  assert.match(article, /property="article:published_time"/);
  assert.match(article, /name="author" content="Team K5 Construction &amp; Development Coordination"/);
}
const admin = await readFile(path.join(root, "dist/public/blog/admin/index.html"), "utf8");
assert.match(admin, /<meta name="robots" content="noindex, follow"/);

const robots = await readFile(path.join(root, "dist/public/robots.txt"), "utf8");
assert.match(robots, /Sitemap: https:\/\/bldpermit\.com\/sitemap\.xml/);
console.log(`SEO verification passed for ${routes.length + landingPaths.length} indexable public routes.`);