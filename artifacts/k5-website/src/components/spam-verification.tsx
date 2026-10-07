import { useEffect, useRef, useState } from "react";

export function SpamVerification({ resetKey, onVerified }: {
  resetKey: number;
  onVerified: (payload: string) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let disposed = false;
    let widget: HTMLElement | undefined;
    setError("");
    onVerified("");
    // Browser-only import: custom elements cannot be initialized during SSR.
    import("altcha").then(() => {
      if (disposed || !host.current) return;
      widget = document.createElement("altcha-widget");
      widget.setAttribute("challenge", `${import.meta.env.BASE_URL}api/contact/challenge`);
      widget.setAttribute("workers", "1");
      widget.addEventListener("statechange", (event) => {
        const detail = (event as CustomEvent<{ state: string; payload?: string }>).detail;
        onVerified(detail.state === "verified" ? detail.payload ?? "" : "");
        setError(detail.state === "error" ? "Verification could not load. Please retry or call us." : "");
      });
      host.current.replaceChildren(widget);
    }).catch(() => {
      if (!disposed) setError("Verification could not load. Please refresh or call us.");
    });
    return () => { disposed = true; widget?.remove(); };
  }, [resetKey, onVerified]);
  return <div>
    <div ref={host} />
    {error && <p role="alert" className="text-sm text-destructive mt-2">{error}</p>}
    <p className="text-xs text-muted-foreground mt-2">Spam verification runs on your device. No third-party verification service is used.</p>
  </div>;
}
