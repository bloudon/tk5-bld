import { Router, type IRouter } from "express";
import { db, blogPostsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router();

const ADMIN_PASSWORD = process.env.BLOG_ADMIN_PASSWORD ?? "teamk5admin";

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
  author: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  published: z.boolean().optional(),
});

router.post("/blog/auth", (req, res) => {
  const { password } = req.body ?? {};
  if (password === ADMIN_PASSWORD) {
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
    res.json(posts);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

router.get("/blog/:slug", async (req, res) => {
  try {
    const [post] = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.slug, req.params.slug));
    if (!post) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(post);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

router.post("/blog", async (req, res) => {
  const { password, ...body } = req.body ?? {};
  if (password !== ADMIN_PASSWORD) {
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
    const [post] = await db
      .insert(blogPostsTable)
      .values({ ...parsed.data, slug })
      .returning();
    res.status(201).json(post);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

router.put("/blog/:id", async (req, res) => {
  const { password, ...body } = req.body ?? {};
  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = PostBody.partial().safeParse(body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data" });
    return;
  }
  try {
    const [post] = await db
      .update(blogPostsTable)
      .set({ ...parsed.data, updatedAt: new Date() })
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
  if (password !== ADMIN_PASSWORD) {
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
