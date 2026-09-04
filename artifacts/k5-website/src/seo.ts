export const SITE_URL = "https://bldpermit.com";
export const SOCIAL_IMAGE = `${SITE_URL}/og-image.png`;

export type SeoDefinition = {
  path: string;
  title: string;
  description: string;
  indexable?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  author?: string;
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
      "Learn how Team K5 Construction & Development Coordination applies municipal experience to permit expediting and project coordination.",
  },
  {
    path: "/services",
    title: "Permit Expediting and Coordination Services | Team K5 C&D",
    description:
      "Explore permit expediting, inspections, e-recording, notary, and coordination from Team K5 Construction & Development Coordination.",
  },
  {
    path: "/pricing",
    title: "Permit Service Pricing and Project Quotes | Team K5 C&D",
    description:
      "Review pricing for permit expediting, inspections, e-recording, and coordination from Team K5 Construction & Development Coordination.",
  },
  {
    path: "/blog",
    title: "Florida Permitting Insights | Team K5 C&D",
    description:
      "Florida permit guidance and construction coordination insights from Team K5 Construction & Development Coordination.",
  },
  {
    path: "/contact",
    title: "Request Permit Expediting Services | Team K5 C&D",
    description:
      "Contact Team K5 Construction & Development Coordination about permit expediting, inspections, and project coordination.",
  },
  {
    path: "/privacy",
    title: "Privacy Policy | Team K5 Construction & Development",
    description:
      "Learn how Team K5 Construction & Development Coordination collects, uses, protects, and manages contact and website analytics information.",
  },
  {
    path: "/terms",
    title: "Website Terms | Team K5 Construction & Development",
    description:
      "Review the website terms for Team K5 Construction & Development Coordination, including informational content and acceptable use.",
  },
  {
    path: "/blog/admin",
    title: "Blog Administration | Team K5 C&D",
    description: "Authenticated publishing administration for Team K5.",
    indexable: false,
  },
  {
    path: "/blog/florida-permit-submittal-checklist",
    title: "Florida Building Permit Submittal Checklist | Team K5",
    description: "Use this practical Florida permit checklist to organize scope, drawings, product approvals, forms, and jurisdiction requirements before submission.",
    type: "article",
    publishedTime: "2025-01-14T12:00:00.000Z",
    author: "Team K5 Construction & Development Coordination",
  },
  {
    path: "/blog/responding-to-florida-permit-review-comments",
    title: "Responding to Florida Permit Review Comments | Team K5",
    description: "Learn how a clear response matrix, coordinated revisions, and disciplined file control can reduce repeat Florida permit review cycles.",
    type: "article",
    publishedTime: "2025-02-11T12:00:00.000Z",
    author: "Team K5 Construction & Development Coordination",
  },
  {
    path: "/blog/florida-notice-of-commencement-permitting",
    title: "Florida Notices of Commencement and Permits | Team K5",
    description: "Learn how Florida Notices of Commencement can intersect with permit and inspection workflows, recording, timing, and project records.",
    type: "article",
    publishedTime: "2025-03-18T12:00:00.000Z",
    author: "Team K5 Construction & Development Coordination",
  },
];

export const notFoundSeo: SeoDefinition = {
  path: "/404",
  title: "Page Not Found | Team K5",
  description: "The requested page could not be found.",
};

export function getSeo(pathname: string): SeoDefinition {
  const exact = publicRoutes.find((route) => route.path === pathname);
  if (exact) return exact;
  if (pathname.startsWith("/blog/")) {
    const slug = pathname.slice("/blog/".length);
    const posts = [
      {
        slug: "florida-permit-submittal-checklist",
        title: "Florida Building Permit Submittal Checklist | Team K5",
        description: "Use this practical Florida permit checklist to organize scope, drawings, product approvals, forms, and jurisdiction requirements before submission.",
        publishedTime: "2025-01-14T12:00:00.000Z",
      },
      {
        slug: "responding-to-florida-permit-review-comments",
        title: "Responding to Florida Permit Review Comments | Team K5",
        description: "Learn how a clear response matrix, coordinated revisions, and disciplined file control can reduce repeat Florida permit review cycles.",
        publishedTime: "2025-02-11T12:00:00.000Z",
      },
      {
        slug: "florida-notice-of-commencement-permitting",
        title: "Florida Notices of Commencement and Permits | Team K5",
        description: "Learn how Florida Notices of Commencement can intersect with permit and inspection workflows, recording, timing, and project records.",
        publishedTime: "2025-03-18T12:00:00.000Z",
      },
    ];
    const post = posts.find((item) => item.slug === slug);
    if (post) return {
      path: pathname,
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedTime,
      author: "Team K5 Construction & Development Coordination",
    };
  }
  return notFoundSeo;
}

export function canonicalUrl(pathname: string): string {
  return `${SITE_URL}${pathname === "/" ? "" : pathname}`;
}