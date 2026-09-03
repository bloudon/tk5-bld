import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const routes = [
  {
    path: "/",
    title: "Permit Expediting & Coordination | Team K5 C&D",
    description:
      "Team K5 Construction & Development Coordination manages permit expediting, inspections, e-recording, and nationwide project coordination. Serving contractors since 2003.",
  },
  {
    path: "/about",
    title: "About Team K5 Construction & Development Coordination",
    description:
      "Meet the former building officials and permit experts behind Team K5's construction and development coordination services.",
  },
  {
    path: "/services",
    title: "Permit Expediting and Coordination Services | Team K5 C&D",
    description:
      "Explore permit expediting, inspection scheduling, e-recording, notary, and construction coordination services from Team K5.",
  },
  {
    path: "/pricing",
    title: "Permit Service Pricing and Project Quotes | Team K5 C&D",
    description:
      "Review transparent pricing for Team K5 permit expediting, inspection scheduling, e-recording, and coordination services.",
  },
  {
    path: "/blog",
    title: "Florida Permitting Insights | Team K5 C&D",
    description:
      "Practical building permit guidance, construction coordination insights, and field notes from Team K5 permit experts.",
  },
  {
    path: "/contact",
    title: "Request Permit Expediting Services | Team K5 C&D",
    description:
      "Contact Team K5 to discuss permit expediting, inspection scheduling, and construction coordination for your project.",
  },
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
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${route.path} must contain exactly one H1`);
  assert.doesNotMatch(html, /<div id="root"><\/div>/);
  assert.match(html, /href="\/(?:about|services|pricing|blog|contact)?"/);
}

const notFound = await readFile(path.join(root, "dist/public/404.html"), "utf8");
assert.match(notFound, /<meta name="robots" content="noindex, follow"/);
assert.match(notFound, /404 Page Not Found/);

const sitemap = await readFile(path.join(root, "dist/public/sitemap.xml"), "utf8");
assert.equal((sitemap.match(/<url>/g) ?? []).length, routes.length - 1);
assert.doesNotMatch(sitemap, /404|admin|expeditepermit|teamk5/);
assert.doesNotMatch(sitemap, /\/blog</);

const blog = await readFile(path.join(root, "dist/public/blog/index.html"), "utf8");
assert.match(blog, /<meta name="robots" content="noindex, follow"/);

const robots = await readFile(path.join(root, "dist/public/robots.txt"), "utf8");
assert.match(robots, /Sitemap: https:\/\/bldpermit\.com\/sitemap\.xml/);
console.log(`SEO verification passed for ${routes.length} public routes.`);