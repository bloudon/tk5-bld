import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BlogAuthModal } from "@/components/blog-auth-modal";
import { BlogEditor } from "@/components/blog-editor";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  published: boolean;
  createdAt: string;
}

const BLOG_IMAGES = [
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541888081622-1bb5924ddc79?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Blog() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading, isError } = useQuery<BlogPost[]>({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const res = await fetch("/api/blog");
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  const handleCreateClick = () => {
    if (adminPassword) {
      setShowEditor(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = (password: string) => {
    setAdminPassword(password);
    setShowAuthModal(false);
    setShowEditor(true);
  };

  const handlePublished = () => {
    setShowEditor(false);
    queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
  };

  if (selectedPost) {
    return (
      <div className="flex flex-col min-h-screen pt-20">
        <section className="py-16 bg-zinc-950 text-white relative">
          <div className="container mx-auto px-4 relative z-10 max-w-3xl">
            <button
              onClick={() => setSelectedPost(null)}
              className="text-zinc-400 hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors"
            >
              ← Back to Field Notes
            </button>
            <div className="inline-block bg-primary text-primary-foreground text-xs font-bold px-3 py-1 uppercase tracking-wider mb-4">
              {selectedPost.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{selectedPost.title}</h1>
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {formatDate(selectedPost.createdAt)}</span>
              <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {selectedPost.author}</span>
            </div>
          </div>
        </section>
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-3xl">
            <div
              className="prose prose-zinc prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pt-20">
      {showAuthModal && (
        <BlogAuthModal
          onSuccess={handleAuthSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}
      {showEditor && adminPassword && (
        <BlogEditor
          password={adminPassword}
          onClose={() => setShowEditor(false)}
          onPublished={handlePublished}
        />
      )}

      <section className="py-20 bg-zinc-950 text-white relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888081622-1bb5924ddc79?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="container mx-auto px-4 relative z-10 flex items-end justify-between">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Field Notes</h1>
            <p className="text-xl text-zinc-400 font-light leading-relaxed">
              Insights, regulatory updates, and hard-learned lessons from decades inside the Florida construction permitting system.
            </p>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="shrink-0 ml-8 hidden md:block">
            <Button
              onClick={handleCreateClick}
              variant="outline"
              className="rounded-none h-11 px-5 border-zinc-600 text-white hover:bg-white hover:text-zinc-900 flex items-center gap-2"
            >
              <PenSquare className="h-4 w-4" />
              Create Post
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile create button */}
          <div className="md:hidden flex justify-end mb-8">
            <Button onClick={handleCreateClick} variant="outline" className="rounded-none h-10 px-4 flex items-center gap-2">
              <PenSquare className="h-4 w-4" />
              Create Post
            </Button>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[0, 1, 2].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-zinc-200 aspect-[4/3] mb-6" />
                  <div className="h-3 bg-zinc-200 rounded w-1/2 mb-4" />
                  <div className="h-5 bg-zinc-200 rounded mb-2" />
                  <div className="h-5 bg-zinc-200 rounded w-3/4 mb-4" />
                  <div className="h-3 bg-zinc-200 rounded mb-2" />
                  <div className="h-3 bg-zinc-200 rounded w-5/6" />
                </div>
              ))}
            </div>
          )}

          {isError && (
            <p className="text-center text-muted-foreground py-16">Failed to load posts. Please try again later.</p>
          )}

          {!isLoading && !isError && posts.length === 0 && (
            <p className="text-center text-muted-foreground py-16">No posts yet. Click "Create Post" to write your first article.</p>
          )}

          {!isLoading && !isError && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group cursor-pointer flex flex-col h-full"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="mb-6 relative overflow-hidden bg-zinc-100 aspect-[4/3] border border-zinc-200 p-2">
                    <div className="w-full h-full bg-zinc-200">
                      <img
                        src={BLOG_IMAGES[i % BLOG_IMAGES.length]}
                        alt=""
                        className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 uppercase tracking-wider shadow-sm">
                      {post.category}
                    </div>
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(post.createdAt)}</span>
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto">
                      <span className="text-sm font-bold text-primary flex items-center group-hover:underline">
                        Read Article <ArrowRight className="ml-1 h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
