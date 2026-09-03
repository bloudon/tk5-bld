export const SITE_URL = "https://bldpermit.com";

export type SeoDefinition = {
  path: string;
  title: string;
  description: string;
  indexable?: boolean;
};

export const publicRoutes: SeoDefinition[] = [
  {
    path: "/",
    title: "Permit Expediting & Coordination | Team K5 C&D",
    description:
      "Team K5 Construction & Development Coordination manages permit expediting, inspections, e-recording, and nationwide project coordination. Serving contractors since 2003.",
  },
  {
    path: "/about",
    title: "About Team K5 Construction & Development Coordination",
    description:
      "Meet the former building officials and permit experts behind Team K5's construction and development coordination services.",
  },
  {
    path: "/services",
    title: "Permit Expediting and Coordination Services | Team K5 C&D",
    description:
      "Explore permit expediting, inspection scheduling, e-recording, notary, and construction coordination services from Team K5.",
  },
  {
    path: "/pricing",
    title: "Permit Service Pricing and Project Quotes | Team K5 C&D",
    description:
      "Review transparent pricing for Team K5 permit expediting, inspection scheduling, e-recording, and coordination services.",
  },
  {
    path: "/blog",
    title: "Florida Permitting Insights | Team K5 C&D",
    description:
      "Practical building permit guidance, construction coordination insights, and field notes from Team K5 permit experts.",
    indexable: false,
  },
  {
    path: "/contact",
    title: "Request Permit Expediting Services | Team K5 C&D",
    description:
      "Contact Team K5 to discuss permit expediting, inspection scheduling, and construction coordination for your project.",
  },
];

export const notFoundSeo: SeoDefinition = {
  path: "/404",
  title: "Page Not Found | Team K5",
  description: "The requested page could not be found.",
};

export function getSeo(pathname: string): SeoDefinition {
  return publicRoutes.find((route) => route.path === pathname) ?? notFoundSeo;
}

export function canonicalUrl(pathname: string): string {
  return `${SITE_URL}${pathname === "/" ? "" : pathname}`;
}