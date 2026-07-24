import { useState, useRef } from "react";
import { X, Bold, Italic, List, Heading2, Link as LinkIcon, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface BlogEditorProps {
  password: string;
  onClose: () => void;
  onPublished: () => void;
}

const CATEGORIES = [
  "Industry Insights",
  "Inspections",
  "Compliance",
  "E-Recording",
  "Notary",
  "Announcements",
];

export function BlogEditor({ password, onClose, onPublished }: BlogEditorProps) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Industry Insights");
  const [author, setAuthor] = useState("Brian Kirby");
  const [saving, setSaving] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertHeading = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    document.execCommand("formatBlock", false, "h2");
    editorRef.current?.focus();
  };

  const handlePublish = async () => {
    const content = editorRef.current?.innerHTML ?? "";
    if (!title.trim() || !excerpt.trim() || !content.trim() || content === "<br>") {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, title, excerpt, content, category, author }),
      });
      if (!res.ok) throw new Error("Failed");
      toast({ title: "Post published!" });
      onPublished();
    } catch {
      toast({ title: "Failed to publish post", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center overflow-y-auto p-4 py-10">
      <div className="bg-white w-full max-w-3xl rounded-none shadow-2xl border border-zinc-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-950">
          <h2 className="text-white font-serif font-bold text-xl">New Blog Post</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <Label className="text-sm font-semibold text-zinc-700 mb-1.5 block">Title *</Label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter post title..."
              className="rounded-none h-11 text-base"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold text-zinc-700 mb-1.5 block">Author</Label>
              <Input
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="rounded-none h-10"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold text-zinc-700 mb-1.5 block">Category</Label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full h-10 border border-input bg-background px-3 text-sm rounded-none focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold text-zinc-700 mb-1.5 block">Excerpt * <span className="font-normal text-zinc-400">(shown on the blog listing)</span></Label>
            <textarea
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              rows={2}
              placeholder="A short summary of the post..."
              className="w-full border border-input bg-background px-3 py-2 text-sm rounded-none focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-zinc-700 mb-1.5 block">Content *</Label>
            <div className="border border-input rounded-none overflow-hidden">
              <div className="flex items-center gap-1 px-2 py-1.5 border-b border-zinc-200 bg-zinc-50">
                <ToolbarBtn onClick={() => exec("bold")} title="Bold"><Bold className="h-4 w-4" /></ToolbarBtn>
                <ToolbarBtn onClick={() => exec("italic")} title="Italic"><Italic className="h-4 w-4" /></ToolbarBtn>
                <div className="w-px h-5 bg-zinc-300 mx-1" />
                <ToolbarBtn onClick={insertHeading} title="Heading"><Heading2 className="h-4 w-4" /></ToolbarBtn>
                <ToolbarBtn onClick={() => exec("insertUnorderedList")} title="Bullet list"><List className="h-4 w-4" /></ToolbarBtn>
                <ToolbarBtn onClick={() => exec("formatBlock", "blockquote")} title="Blockquote"><Quote className="h-4 w-4" /></ToolbarBtn>
                <div className="w-px h-5 bg-zinc-300 mx-1" />
                <ToolbarBtn
                  onClick={() => {
                    const url = prompt("Enter URL:");
                    if (url) exec("createLink", url);
                  }}
                  title="Insert link"
                >
                  <LinkIcon className="h-4 w-4" />
                </ToolbarBtn>
              </div>
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="min-h-[300px] max-h-[480px] overflow-y-auto px-4 py-3 text-sm text-zinc-800 focus:outline-none prose prose-sm max-w-none"
                data-placeholder="Write your article here..."
                onInput={() => {}}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-200 bg-zinc-50">
          <Button variant="outline" onClick={onClose} className="rounded-none">Cancel</Button>
          <Button onClick={handlePublish} disabled={saving} className="rounded-none bg-primary text-primary-foreground px-8">
            {saving ? "Publishing..." : "Publish Post"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ToolbarBtn({ onClick, children, title }: { onClick: () => void; children: React.ReactNode; title: string }) {
  return (
    <button
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      title={title}
      className="p-1.5 rounded hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 transition-colors"
    >
      {children}
    </button>
  );
}
