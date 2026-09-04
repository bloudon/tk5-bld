import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Services from "@/pages/services";
import Pricing from "@/pages/pricing";
import Blog from "@/pages/blog";
import Contact from "@/pages/contact";
import BlogArticle from "@/pages/blog-article";
import BlogAdmin from "@/pages/blog-admin";
import { Privacy, Terms } from "@/pages/legal";
import { Layout } from "@/components/layout";
import { landingPages } from "@/landing-pages";
import LandingPage from "@/pages/landing-page";
import { canonicalUrl, getSeo, SOCIAL_IMAGE } from "@/seo";
import { loadAnalytics, track, trackCurrentPage } from "@/analytics";

const queryClient = new QueryClient();

function SeoHead() {
  const [location] = useLocation();

  useEffect(() => {
    const seo = getSeo(location);
    const canonical = canonicalUrl(seo.path);
    document.title = seo.title;

    const values: Array<[string, string, string]> = [
      ["meta", 'name="description"', seo.description],
      ["meta", 'name="robots"', seo.indexable === false || seo.path === "/404" ? "noindex, follow" : "index, follow"],
      ["meta", 'property="og:title"', seo.title],
      ["meta", 'property="og:description"', seo.description],
      ["meta", 'property="og:url"', canonical],
      ["meta", 'property="og:image"', SOCIAL_IMAGE],
      ["meta", 'property="og:type"', seo.type ?? "website"],
      ["meta", 'name="twitter:title"', seo.title],
      ["meta", 'name="twitter:description"', seo.description],
      ["meta", 'name="twitter:image"', SOCIAL_IMAGE],
      ["link", 'rel="canonical"', canonical],
    ];

    for (const [tag, selector, value] of values) {
      const element = document.head.querySelector<HTMLElement>(`${tag}[${selector}]`);
      if (!element) continue;
      if (tag === "link") element.setAttribute("href", value);
      else element.setAttribute("content", value);
    }
    loadAnalytics();
    trackCurrentPage();
  }, [location]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest("a");
      if (!anchor) return;
      if (anchor.href.startsWith("tel:")) track("click_to_call", { link_url: anchor.href });
      if (anchor.href.startsWith("mailto:")) track("click_to_email", { link_url: anchor.href });
      if (anchor.origin === window.location.origin && !anchor.href.startsWith("mailto:") && !anchor.href.startsWith("tel:")) {
        track("navigation_click", {
          link_url: anchor.href,
          link_text: anchor.textContent?.trim() || undefined,
        });
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      {landingPages.map(page => (
        <Route key={page.path} path={page.path}>
          {() => <LandingPage page={page} />}
        </Route>
      ))}
      <Route path="/pricing" component={Pricing} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/admin" component={BlogAdmin} />
      <Route path="/blog/:slug" component={BlogArticle} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App({ ssrPath }: { ssrPath?: string }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter
          base={import.meta.env.BASE_URL.replace(/\/$/, "")}
          ssrPath={ssrPath}
        >
          <SeoHead />
          <Layout>
            <Router />
          </Layout>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
