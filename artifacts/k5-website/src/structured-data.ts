import { landingPages } from "./landing-pages";
import { canonicalUrl, getSeo, SITE_URL, SOCIAL_IMAGE } from "./seo";

const organization = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Team K5 Construction & Development Coordination",
  legalName: "Team K5 Construction and Development Coordination, LLC",
  alternateName: "Team K5 C&D",
  url: SITE_URL,
  logo: SOCIAL_IMAGE,
  telephone: "+1-407-469-5599",
  email: "permitting@expeditepermit.com",
  foundingDate: "2003",
  areaServed: [
    { "@type": "AdministrativeArea", name: "Central Florida" },
    { "@type": "AdministrativeArea", name: "Tampa Bay" },
    { "@type": "AdministrativeArea", name: "South Florida" },
    { "@type": "Country", name: "United States" },
  ],
};

const marketAreas: Record<string, string[]> = {
  "/markets/florida-permit-expediting": ["Florida"],
  "/markets/orlando-permit-expediting": ["City of Orlando", "Orange County, Florida"],
  "/markets/tampa-permit-expediting": ["City of Tampa", "Hillsborough County, Florida"],
  "/markets/palm-beach-permit-expediting": ["Palm Beach County, Florida"],
};

/** Shared by prerendering and client navigation so route metadata stays aligned. */
export function getStructuredData(pathname: string) {
  const seo = getSeo(pathname);
  if (seo.path === "/404" || seo.indexable === false) return null;
  const canonical = canonicalUrl(seo.path);
  const page = landingPages.find((item) => item.path === seo.path);
  const graph: Record<string, unknown>[] = [organization];
  const reference = { "@id": organization["@id"] };

  if (page || seo.path === "/services") {
    graph.push({
      "@type": "Service",
      "@id": `${canonical}#service`,
      url: canonical,
      name: page?.title ?? "Permit Expediting and Coordination Services",
      serviceType: page?.kind === "market" ? "Permit expediting" : page?.title ?? "Permit expediting and coordination",
      description: page?.intro ?? seo.description,
      provider: reference,
      areaServed: page?.kind === "market"
        ? marketAreas[page.path]?.map((name) => ({ "@type": "AdministrativeArea", name }))
        : organization.areaServed,
      mainEntityOfPage: canonical,
    });
  }

  if (seo.type === "article") {
    graph.push({
      "@type": "Article",
      "@id": `${canonical}#article`,
      headline: seo.title,
      description: seo.description,
      datePublished: seo.publishedTime,
      dateModified: seo.publishedTime,
      mainEntityOfPage: canonical,
      image: SOCIAL_IMAGE,
      author: { ...reference, "@type": "Organization", name: seo.author },
      publisher: reference,
    });
  }

  if (seo.path !== "/") {
    const trail = [{ name: "Home", item: SITE_URL }];
    if (seo.path.startsWith("/services/")) {
      trail.push({ name: "Services", item: `${SITE_URL}/services` });
    } else if (seo.type === "article") {
      trail.push({ name: "Blog", item: `${SITE_URL}/blog` });
    }
    // There is no /markets index: don't invent a breadcrumb destination.
    trail.push({ name: page?.title ?? seo.title.split(" | ")[0], item: canonical });
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${canonical}#breadcrumb`,
      itemListElement: trail.map((item, index) => ({
        "@type": "ListItem", position: index + 1, ...item,
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
