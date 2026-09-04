import { useEffect, useState } from "react";
import { analyticsConsent, setAnalyticsConsent, trackCurrentPage } from "@/analytics";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

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
    <aside className="fixed bottom-0 inset-x-0 z-[70] bg-zinc-950 text-white border-t border-zinc-700 p-4" aria-label="Analytics consent">
      <div className="container mx-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <p className="text-sm text-zinc-300 max-w-3xl">We use optional analytics to understand site use and improve our services. Analytics loads only if you accept. See our <Link href="/privacy" className="underline">Privacy Policy</Link>.</p>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => choose(false)}>Decline</Button>
          <Button size="sm" onClick={() => choose(true)}>Accept analytics</Button>
        </div>
      </div>
    </aside>
  );
}