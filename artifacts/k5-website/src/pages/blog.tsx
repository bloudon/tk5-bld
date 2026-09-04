import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { seededPosts, type BlogPost } from "@/blog-posts";

const BLOG_IMAGES = [
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop",
];

export default function Blog() {
  const { data: publishedPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const response = await fetch("/api/blog");
      if (!response.ok) throw new Error("Unable to load published articles");
      return response.json();
    },
  });
  const posts = [
    ...publishedPosts.filter((post) => !seededPosts.some((seeded) => seeded.slug === post.slug)),
    ...seededPosts,
  ];

  return <div className="flex flex-col min-h-screen">
    <section className="py-20 bg-zinc-950 text-white relative">
      <div className="container mx-auto px-4 relative z-10 max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Florida Permitting Insights</h1>
        <p className="text-xl text-zinc-400 font-light leading-relaxed">Original guidance for planning permit submittals, responding to reviews, and coordinating Florida construction documents.</p>
      </div>
    </section>
    <section className="py-24 bg-background"><div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, i) => {
          const articleUrl = post.id > 0 ? `/api/blog/${post.slug}` : `/blog/${post.slug}`;
          return <motion.article key={post.slug} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group flex flex-col h-full">
          <a href={articleUrl} className="block mb-6 overflow-hidden bg-zinc-200 aspect-[4/3]">
            <img src={BLOG_IMAGES[i % BLOG_IMAGES.length]} alt={`Florida permitting guidance: ${post.title}`} className="w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 transition-transform duration-700" loading="lazy" width="800" height="600" />
          </a>
          <p className="text-xs uppercase tracking-wider text-primary font-bold">{post.category}</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground mt-3"><Calendar className="h-3 w-3" />{new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          <h2 className="text-2xl font-serif font-bold mt-3 mb-3"><a href={articleUrl} className="group-hover:text-primary">{post.title}</a></h2>
          <p className="text-muted-foreground mb-6">{post.excerpt}</p>
          <a href={articleUrl} className="mt-auto text-sm font-bold text-primary flex items-center">Read Article <ArrowRight className="ml-1 h-4 w-4" /></a>
        </motion.article>;
        })}
      </div>
    </div></section>
  </div>;
}