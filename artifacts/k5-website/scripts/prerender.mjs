import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "dist/public");
const serverDir = path.join(root, "dist/server");
const template = await readFile(path.join(publicDir, "index.html"), "utf8");
const { canonicalUrl, notFoundSeo, publicRoutes, render } = await import(
  pathToFileURL(path.join(serverDir, "entry-server.js"))
);

function escape(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function documentFor(route, pathname, robots = "index, follow") {
  const canonical = canonicalUrl(pathname);
  return template
    .replace(/<title>.*?<\/title>/, `<title>${escape(route.title)}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/>/, `<meta name="description" content="${escape(route.description)}" />`)
    .replace(/<meta name="robots" content=".*?"\s*\/>/, `<meta name="robots" content="${robots}" />`)
    .replace(/<meta property="og:title" content=".*?"\s*\/>/, `<meta property="og:title" content="${escape(route.title)}" />`)
    .replace(/<meta property="og:description" content=".*?"\s*\/>/, `<meta property="og:description" content="${escape(route.description)}" />`)
    .replace(/<meta property="og:url" content=".*?"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta name="twitter:title" content=".*?"\s*\/>/, `<meta name="twitter:title" content="${escape(route.title)}" />`)
    .replace(/<meta name="twitter:description" content=".*?"\s*\/>/, `<meta name="twitter:description" content="${escape(route.description)}" />`)
    .replace(/<link rel="canonical" href=".*?"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace('<div id="root"></div>', `<div id="root">${render(pathname)}</div>`);
}

for (const route of publicRoutes) {
  const output = route.path === "/" ? publicDir : path.join(publicDir, route.path.slice(1));
  await mkdir(output, { recursive: true });
  await writeFile(
    path.join(output, "index.html"),
    documentFor(route, route.path, route.indexable === false ? "noindex, follow" : "index, follow"),
  );
}

await writeFile(path.join(publicDir, "404.html"), documentFor(notFoundSeo, "/404", "noindex, follow"));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publicRoutes.filter((route) => route.indexable !== false).map(({ path: pathname }) => `  <url><loc>${canonicalUrl(pathname)}</loc></url>`).join("\n")}
</urlset>
`;
await writeFile(path.join(publicDir, "sitemap.xml"), sitemap);
await rm(serverDir, { recursive: true, force: true });