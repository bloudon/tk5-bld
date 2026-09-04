import { Router, type IRouter } from "express";
import { db, blogPostsTable } from "@workspace/db";
import { and, eq, desc } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router();

const ADMIN_PASSWORD = process.env.BLOG_ADMIN_PASSWORD;
const SITE_URL = "https://bldpermit.com";
const SOCIAL_IMAGE = `${SITE_URL}/og-image.png`;
const ALLOWED_TAGS = new Set(["p", "br", "h2", "strong", "b", "em", "i", "ul", "ol", "li", "blockquote", "a"]);

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const escapeXml = escapeHtml;

function sanitizeArticleHtml(input: string): string {
  const withoutActiveBlocks = input.replace(
    /<(script|style|iframe|object|embed|svg|math|template|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
    "",
  );

  return withoutActiveBlocks.replace(/<[^>]*>/g, (token) => {
    const match = token.match(/^<\s*(\/?)\s*([a-z0-9]+)\b([^>]*)>$/i);
    if (!match) return "";
    const closing = match[1] === "/";
    const tag = match[2].toLowerCase();
    const attributes = match[3];
    if (!ALLOWED_TAGS.has(tag)) return "";
    if (closing) return tag === "br" ? "" : `</${tag}>`;
    if (tag === "br") return "<br>";
    if (tag !== "a") return `<${tag}>`;

    const hrefMatch = attributes.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/i);
    const href = hrefMatch?.[1] ?? hrefMatch?.[2] ?? hrefMatch?.[3] ?? "";
    const allowedHref = href.startsWith("/") || /^https?:\/\//i.test(href) || /^mailto:/i.test(href);
    return allowedHref
      ? `<a href="${escapeHtml(href)}" rel="noopener noreferrer">`
      : "<a>";
  });
}

function articleDocument(post: typeof blogPostsTable.$inferSelect): string {
  const title = `${post.title} | Team K5`;
  const canonical = `${SITE_URL}/api/blog/${encodeURIComponent(post.slug)}`;
  const publishedTime = post.createdAt.toISOString();
  const modifiedTime = post.updatedAt.toISOString();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    mainEntityOfPage: canonical,
    image: SOCIAL_IMAGE,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Team K5 Construction & Development Coordination",
      logo: { "@type": "ImageObject", url: SOCIAL_IMAGE },
    },
  };

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(post.excerpt)}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${canonical}">
    <meta property="og:type" content="article">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(post.excerpt)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${SOCIAL_IMAGE}">
    <meta property="article:published_time" content="${publishedTime}">
    <meta property="article:modified_time" content="${modifiedTime}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(post.excerpt)}">
    <meta name="twitter:image" content="${SOCIAL_IMAGE}">
    <meta name="author" content="${escapeHtml(post.author)}">
    <script type="application/ld+json">${JSON.stringify(structuredData).replaceAll("<", "\\u003c")}</script>
    <style>
      :root{font-family:Inter,system-ui,sans-serif;color:#18181b;background:#fafafa}body{margin:0}
      header{background:#09090b;color:#fff;padding:1.25rem}nav{max-width:960px;margin:auto;display:flex;justify-content:space-between;gap:1rem;align-items:center}
      nav a{color:#fff;text-decoration:none;font-weight:700}.hero{background:#09090b;color:#fff;padding:4rem 1.25rem}.wrap{max-width:760px;margin:auto}
      .category{color:#f59e0b;text-transform:uppercase;letter-spacing:.12em;font-size:.75rem;font-weight:700}h1{font-family:Georgia,serif;font-size:clamp(2.25rem,7vw,4rem);line-height:1.05;margin:.75rem 0 1.25rem}
      .meta{color:#a1a1aa}.content{padding:3rem 1.25rem 5rem;line-height:1.75;font-size:1.08rem}.content h2{font-family:Georgia,serif;font-size:1.8rem;margin-top:2.25rem}
      .content a{color:#b45309}footer{border-top:1px solid #e4e4e7;padding:2rem 1.25rem;color:#52525b;font-size:.85rem}
    </style>
  </head>
  <body>
    <header><nav><a href="${SITE_URL}">Team K5 Construction &amp; Development Coordination</a><a href="${SITE_URL}/blog">Florida Permitting Insights</a></nav></header>
    <main>
      <section class="hero"><div class="wrap"><p class="category">${escapeHtml(post.category)}</p><h1>${escapeHtml(post.title)}</h1><p class="meta">${escapeHtml(new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }))} · ${escapeHtml(post.author)}</p></div></section>
      <article class="content wrap">${sanitizeArticleHtml(post.content)}</article>
    </main>
    <footer><div class="wrap">© ${new Date().getUTCFullYear()} Team K5 Construction and Development Coordination, LLC · <a href="${SITE_URL}/privacy">Privacy</a> · <a href="${SITE_URL}/terms">Terms</a></div></footer>
  </body>
</html>`;
}

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

const PostBody = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  author: z.string().min(1).default("Team K5 Construction & Development Coordination"),
  category: z.string().min(1).optional(),
  published: z.boolean().optional(),
});

router.post("/blog/auth", (req, res) => {
  const { password } = req.body ?? {};
  if (ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
    res.json({ ok: true });
  } else {
    res.status(401).json({ ok: false, error: "Invalid password" });
  }
});

router.get("/blog", async (req, res) => {
  try {
    const posts = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.published, true))
      .orderBy(desc(blogPostsTable.createdAt));
    res.json(posts.map((post) => ({ ...post, content: sanitizeArticleHtml(post.content) })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

router.get("/blog/sitemap.xml", async (req, res) => {
  try {
    const posts = await db
      .select({ slug: blogPostsTable.slug, updatedAt: blogPostsTable.updatedAt })
      .from(blogPostsTable)
      .where(eq(blogPostsTable.published, true))
      .orderBy(desc(blogPostsTable.createdAt));
    const urls = posts.map((post) =>
      `  <url><loc>${escapeXml(`${SITE_URL}/api/blog/${encodeURIComponent(post.slug)}`)}</loc><lastmod>${post.updatedAt.toISOString()}</lastmod></url>`,
    ).join("\n");
    res.type("application/xml").send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).type("application/xml").send(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
    );
  }
});

router.get("/blog/:slug", async (req, res) => {
  try {
    const [post] = await db
      .select()
      .from(blogPostsTable)
      .where(and(eq(blogPostsTable.slug, req.params.slug), eq(blogPostsTable.published, true)));
    if (!post) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const safePost = { ...post, content: sanitizeArticleHtml(post.content) };
    if (req.headers.accept?.includes("text/html")) {
      res.type("html").send(articleDocument(safePost));
      return;
    }
    res.json(safePost);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

router.post("/blog", async (req, res) => {
  const { password, ...body } = req.body ?? {};
  if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = PostBody.safeParse(body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data", details: parsed.error.issues });
    return;
  }
  try {
    const slug = slugify(parsed.data.title);
    const sanitizedContent = sanitizeArticleHtml(parsed.data.content);
    const [post] = await db
      .insert(blogPostsTable)
      .values({ ...parsed.data, content: sanitizedContent, slug })
      .returning();
    res.status(201).json(post);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

router.put("/blog/:id", async (req, res) => {
  const { password, ...body } = req.body ?? {};
  if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = PostBody.partial().safeParse(body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data" });
    return;
  }
  try {
    const updates = {
      ...parsed.data,
      ...(parsed.data.content ? { content: sanitizeArticleHtml(parsed.data.content) } : {}),
      updatedAt: new Date(),
    };
    const [post] = await db
      .update(blogPostsTable)
      .set(updates)
      .where(eq(blogPostsTable.id, parseInt(req.params.id)))
      .returning();
    if (!post) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(post);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update post" });
  }
});

router.delete("/blog/:id", async (req, res) => {
  const { password } = req.body ?? {};
  if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    await db.delete(blogPostsTable).where(eq(blogPostsTable.id, parseInt(req.params.id)));
    res.json({ ok: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

export default router;
