import { useEffect } from "react";
import { Calendar } from "lucide-react";
import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getSeededPost, type BlogPost } from "@/blog-posts";
import { SITE_URL, SOCIAL_IMAGE } from "@/seo";

export default function BlogArticle() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug ?? "";
  const seededPost = getSeededPost(slug);
  const { data: publishedPost, isLoading, isError } = useQuery<BlogPost>({
    queryKey: ["blog-post", slug],
    enabled: Boolean(slug && !seededPost),
    queryFn: async () => {
      const response = await fetch(`/api/blog/${encodeURIComponent(slug)}`);
      if (!response.ok) throw new Error("Article not found");
      return response.json();
    },
  });
  const post = seededPost ?? publishedPost;

  useEffect(() => {
    if (!publishedPost || seededPost) return;
    const canonical = `${SITE_URL}/blog/${publishedPost.slug}`;
    document.title = `${publishedPost.title} | Team K5`;
    const updates: Array<[string, string, string]> = [
      ["meta", 'name="description"', publishedPost.excerpt],
      ["meta", 'name="robots"', "index, follow"],
      ["meta", 'property="og:title"', document.title],
      ["meta", 'property="og:description"', publishedPost.excerpt],
      ["meta", 'property="og:url"', canonical],
      ["meta", 'property="og:type"', "article"],
      ["meta", 'property="og:image"', SOCIAL_IMAGE],
      ["meta", 'name="twitter:title"', document.title],
      ["meta", 'name="twitter:description"', publishedPost.excerpt],
      ["meta", 'name="twitter:image"', SOCIAL_IMAGE],
      ["link", 'rel="canonical"', canonical],
    ];
    for (const [tag, selector, value] of updates) {
      const element = document.head.querySelector<HTMLElement>(`${tag}[${selector}]`);
      if (!element) continue;
      if (tag === "link") element.setAttribute("href", value);
      else element.setAttribute("content", value);
    }
  }, [publishedPost, seededPost]);

  if (!post && isLoading) {
    return <div className="py-20 container mx-auto px-4"><h1 className="text-4xl font-serif font-bold">Loading article…</h1></div>;
  }
  if (!post || isError) return <div className="py-20 container mx-auto px-4"><h1 className="text-4xl font-serif font-bold">Article Not Found</h1><p className="mt-4"><Link href="/blog" className="text-primary underline">Return to Florida permitting insights</Link></p></div>;
  const date = new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return <article>
    <header className="py-16 bg-zinc-950 text-white"><div className="container mx-auto px-4 max-w-3xl">
      <Link href="/blog" className="text-zinc-300 text-sm">← Florida Permitting Insights</Link>
      <p className="text-primary uppercase tracking-wider text-xs font-bold mt-8">{post.category}</p>
      <h1 className="text-4xl md:text-5xl font-serif font-bold mt-3">{post.title}</h1>
      <p className="flex items-center gap-2 text-zinc-400 mt-5"><Calendar className="h-4 w-4" />{date} · {post.author}</p>
    </div></header>
    <div className="container mx-auto px-4 py-16 max-w-3xl prose prose-zinc prose-lg" dangerouslySetInnerHTML={{ __html: post.content }} />
  </article>;
}