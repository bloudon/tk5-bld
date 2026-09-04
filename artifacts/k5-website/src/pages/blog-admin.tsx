import { useState } from "react";
import { useLocation } from "wouter";
import { BlogAuthModal } from "@/components/blog-auth-modal";
import { BlogEditor } from "@/components/blog-editor";

export default function BlogAdmin() {
  const [, navigate] = useLocation();
  const [password, setPassword] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  return <div className="min-h-[70vh]">
    <section className="py-16 bg-zinc-950 text-white"><div className="container mx-auto px-4"><h1 className="text-4xl font-serif font-bold">Blog Administration</h1><p className="mt-3 text-zinc-400">Authentication is required to publish.</p></div></section>
    <div className="container mx-auto px-4 py-16"><button className="bg-primary text-primary-foreground px-5 py-3 font-semibold" onClick={() => password ? setEditing(true) : undefined}>Create article</button></div>
    {!password && <BlogAuthModal onSuccess={(value) => { setPassword(value); setEditing(true); }} onClose={() => navigate("/blog")} />}
    {editing && password && <BlogEditor password={password} onClose={() => setEditing(false)} onPublished={() => setEditing(false)} />}
  </div>;
}