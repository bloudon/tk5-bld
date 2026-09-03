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
import { Layout } from "@/components/layout";
import { canonicalUrl, getSeo } from "@/seo";

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
      ["meta", 'name="twitter:title"', seo.title],
      ["meta", 'name="twitter:description"', seo.description],
      ["link", 'rel="canonical"', canonical],
    ];

    for (const [tag, selector, value] of values) {
      const element = document.head.querySelector<HTMLElement>(`${tag}[${selector}]`);
      if (!element) continue;
      if (tag === "link") element.setAttribute("href", value);
      else element.setAttribute("content", value);
    }
  }, [location]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/blog" component={Blog} />
      <Route path="/contact" component={Contact} />
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
