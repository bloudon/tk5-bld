import { useEffect, useState } from "react";
import { analyticsConsent, setAnalyticsConsent, trackCurrentPage } from "@/analytics";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Cookie } from "lucide-react";

export function AnalyticsConsent() {
  const [visible, setVisible] = useState(() => typeof window !== "undefined" && analyticsConsent() === null);

  useEffect(() => {
    const showChoices = () => setVisible(true);
    window.addEventListener("teamk5:show-analytics-choices", showChoices);
    return () => window.removeEventListener("teamk5:show-analytics-choices", showChoices);
  }, []);

  if (!visible) return null;
  const choose = (granted: boolean) => {
    setAnalyticsConsent(granted);
    if (granted) trackCurrentPage();
    setVisible(false);
  };
  return (
    <aside
      className="fixed bottom-4 left-4 right-4 z-[70] sm:right-auto sm:max-w-md rounded-lg border border-zinc-200 bg-white p-5 text-zinc-900 shadow-2xl"
      aria-label="Cookie preferences"
      role="dialog"
      aria-modal="false"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Cookie className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-serif text-lg font-bold">We use cookies</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            We use optional analytics cookies to understand how visitors use our
            website and improve our services. You can accept or reject these
            cookies. See our{" "}
            <Link href="/privacy" className="font-medium text-primary underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => choose(false)}
        >
          Reject optional cookies
        </Button>
        <Button
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => choose(true)}
        >
          Accept cookies
        </Button>
        </div>
    </aside>
  );
}