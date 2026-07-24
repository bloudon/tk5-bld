import { useState } from "react";
import { X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BlogAuthModalProps {
  onSuccess: (password: string) => void;
  onClose: () => void;
}

export function BlogAuthModal({ onSuccess, onClose }: BlogAuthModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/blog/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onSuccess(password);
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm shadow-2xl border border-zinc-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-950">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-zinc-400" />
            <h2 className="text-white font-serif font-bold">Admin Login</h2>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-zinc-500">Enter your admin password to create a new blog post.</p>
          <div>
            <Label className="text-sm font-semibold text-zinc-700 mb-1.5 block">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              className="rounded-none h-11"
              placeholder="••••••••"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          <Button type="submit" disabled={loading || !password} className="w-full rounded-none h-11 bg-primary text-primary-foreground">
            {loading ? "Checking..." : "Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
