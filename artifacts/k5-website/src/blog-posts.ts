export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  published: boolean;
  createdAt: string;
  content: string;
};

export const seededPosts: BlogPost[] = [
  {
    id: -1,
    slug: "florida-permit-submittal-checklist",
    title: "A Practical Florida Building Permit Submittal Checklist",
    excerpt: "Reduce avoidable review comments by organizing scope, drawings, product approvals, and jurisdiction-specific forms before submission.",
    author: "Team K5 Construction & Development Coordination",
    category: "Permit Planning",
    published: true,
    createdAt: "2025-01-14T12:00:00.000Z",
    content: `<p>A complete permit package begins before a file reaches a municipal portal. Florida jurisdictions apply the Florida Building Code alongside local zoning, floodplain, historic district, and administrative requirements. The exact checklist therefore depends on the property, scope, and reviewing authority.</p>
<h2>Confirm jurisdiction and scope</h2><p>Verify which city or county has authority over the parcel. Write a concise scope that agrees with the contract, plans, and application. Identify related trades and whether separate electrical, plumbing, mechanical, roofing, or right-of-way permits may be required.</p>
<h2>Coordinate the core documents</h2><p>Check that plan sheets carry consistent project information and current professional seals where required. Gather owner and contractor details, recorded notices when applicable, energy calculations, site information, and Florida product approvals for regulated exterior components. File names should be clear and portal-compatible.</p>
<h2>Run a pre-submittal review</h2><p>Compare every form against the drawings, confirm signatures, and review jurisdiction instructions immediately before uploading. Requirements and portal workflows change. A short quality-control pass can prevent an administrative rejection that delays the start of technical review.</p>
<p>This checklist is general planning information, not legal or code advice. Confirm current requirements with the authority having jurisdiction for each project.</p>`,
  },
  {
    id: -2,
    slug: "responding-to-florida-permit-review-comments",
    title: "How to Respond to Florida Permit Review Comments",
    excerpt: "A disciplined response matrix helps design teams resolve comments clearly, preserve version control, and avoid repeated review cycles.",
    author: "Team K5 Construction & Development Coordination",
    category: "Plan Review",
    published: true,
    createdAt: "2025-02-11T12:00:00.000Z",
    content: `<p>Review comments are a normal part of permitting. Delays often arise not from receiving comments, but from incomplete responses, conflicting revisions, or files uploaded without a clear explanation of what changed.</p>
<h2>Create one response matrix</h2><p>Copy each agency comment into a numbered log. Assign an owner, note the affected sheet or document, and provide a direct response. Avoid answers such as “corrected” without identifying the revision. The reviewer should be able to move from comment to response to drawing change quickly.</p>
<h2>Control revisions</h2><p>Coordinate consultants before resubmission so architectural, structural, and trade sheets remain consistent. Use the jurisdiction’s required naming and revision conventions. Remove superseded files only when the portal and agency instructions permit it, and retain a project record of each submitted set.</p>
<h2>Check the package as a whole</h2><p>Before uploading, verify that every comment has a response and every promised change appears in the documents. Confirm new revisions did not create conflicts elsewhere. If a comment is unclear, seek clarification through the jurisdiction’s approved channel rather than guessing.</p>
<p>Processes vary by authority and project. Always follow the current instructions issued for the specific application.</p>`,
  },
  {
    id: -3,
    slug: "florida-notice-of-commencement-permitting",
    title: "Florida Notices of Commencement and the Permit Process",
    excerpt: "Understand when a recorded Notice of Commencement may affect permit issuance or inspections and how to plan document handling.",
    author: "Team K5 Construction & Development Coordination",
    category: "Project Documents",
    published: true,
    createdAt: "2025-03-18T12:00:00.000Z",
    content: `<p>A Notice of Commencement is a recorded construction document used in Florida’s lien-law framework. Depending on project facts and local procedure, a certified copy may need to be provided to the permitting authority before the first inspection. It is separate from the building permit application even when the workflows intersect.</p>
<h2>Prepare accurate project information</h2><p>The document generally identifies the property, owner, contractor, lender when applicable, and other statutory information. Legal descriptions and ownership details should be checked against reliable records. Execution, notarization, recording, posting, and expiration questions should be handled carefully.</p>
<h2>Coordinate timing</h2><p>Recording too early can create timing concerns if work is delayed, while waiting too long may affect inspections. Confirm the permit authority’s current procedure for uploading or presenting the recorded document and make sure the field team knows any posting requirement.</p>
<h2>Keep records aligned</h2><p>Names, property information, and scope references should remain consistent across the permit application and project documents. Save the recorded instrument and recording data in the permanent project file.</p>
<p>This article is general information and is not legal advice. Florida lien law has project-specific exceptions and consequences; consult qualified counsel and the applicable authority when needed.</p>`,
  },
];

export function getSeededPost(slug: string) {
  return seededPosts.find((post) => post.slug === slug);
}