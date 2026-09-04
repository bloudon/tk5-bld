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
  const structuredData = pathname === "/" ? {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Team K5 Construction & Development Coordination",
    legalName: "Team K5 Construction and Development Coordination, LLC",
    alternateName: "Team K5 C&D",
    url: "https://bldpermit.com",
    logo: "https://bldpermit.com/og-image.png",
    telephone: "+1-407-469-5599",
    email: "permitting@expeditepermit.com",
    foundingDate: "2003",
    areaServed: [
      { "@type": "AdministrativeArea", name: "Central Florida" },
      { "@type": "AdministrativeArea", name: "Tampa Bay" },
      { "@type": "AdministrativeArea", name: "South Florida" },
      { "@type": "Country", name: "United States" },
    ],
  } : route.type === "article" ? {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: route.title,
    description: route.description,
    datePublished: route.publishedTime,
    dateModified: route.publishedTime,
    mainEntityOfPage: canonical,
    image: "https://bldpermit.com/og-image.png",
    author: { "@type": "Organization", name: route.author },
    publisher: {
      "@type": "Organization",
      name: "Team K5 Construction & Development Coordination",
      logo: { "@type": "ImageObject", url: "https://bldpermit.com/og-image.png" },
    },
  } : null;
  let document = template
    .replace(/<title>.*?<\/title>/, `<title>${escape(route.title)}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/>/, `<meta name="description" content="${escape(route.description)}" />`)
    .replace(/<meta name="robots" content=".*?"\s*\/>/, `<meta name="robots" content="${robots}" />`)
    .replace(/<meta property="og:title" content=".*?"\s*\/>/, `<meta property="og:title" content="${escape(route.title)}" />`)
    .replace(/<meta property="og:description" content=".*?"\s*\/>/, `<meta property="og:description" content="${escape(route.description)}" />`)
    .replace(/<meta property="og:url" content=".*?"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta property="og:type" content=".*?"\s*\/>/, `<meta property="og:type" content="${route.type ?? "website"}" />`)
    .replace(/<meta property="og:image" content=".*?"\s*\/>/, `<meta property="og:image" content="https://bldpermit.com/og-image.png" />`)
    .replace(/<meta name="twitter:title" content=".*?"\s*\/>/, `<meta name="twitter:title" content="${escape(route.title)}" />`)
    .replace(/<meta name="twitter:description" content=".*?"\s*\/>/, `<meta name="twitter:description" content="${escape(route.description)}" />`)
    .replace(/<meta name="twitter:image" content=".*?"\s*\/>/, `<meta name="twitter:image" content="https://bldpermit.com/og-image.png" />`)
    .replace(/<link rel="canonical" href=".*?"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace('<div id="root"></div>', `<div id="root">${render(pathname)}</div>`);
  if (structuredData) {
    const articleMeta = route.type === "article"
      ? `<meta property="article:published_time" content="${escape(route.publishedTime)}" />\n    <meta name="author" content="${escape(route.author)}" />\n    `
      : "";
    document = document.replace("</head>", `${articleMeta}<script type="application/ld+json">${JSON.stringify(structuredData).replaceAll("<", "\\u003c")}</script>\n  </head>`);
  }
  return document;
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

const staticSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publicRoutes.filter((route) => route.indexable !== false).map(({ path: pathname }) => `  <url><loc>${canonicalUrl(pathname)}</loc></url>`).join("\n")}
</urlset>
`;
await writeFile(path.join(publicDir, "sitemap-static.xml"), staticSitemap);
await writeFile(
  path.join(publicDir, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>https://bldpermit.com/sitemap-static.xml</loc></sitemap>
  <sitemap><loc>https://bldpermit.com/api/blog/sitemap.xml</loc></sitemap>
</sitemapindex>
`,
);
await rm(serverDir, { recursive: true, force: true });