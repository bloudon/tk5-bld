import { COMPANY } from "@/site";

export function Privacy() {
  return <LegalPage title="Privacy Policy">
    <p>Last updated: March 18, 2025</p>
    <p>{COMPANY.legalName} collects information you submit through our contact form, including contact details, company, requested service, service area, project details, and basic referral or campaign attribution. We use it to respond to requests, provide services, maintain business records, prevent misuse, and improve our website.</p>
    <h2>Analytics and cookies</h2><p>Optional Google Tag Manager or Google Analytics measurement is loaded only after you accept analytics. You may decline without losing access to the website. Campaign parameters and referring-page information may accompany a contact request so we can understand how the request reached us.</p>
    <h2>Sharing and retention</h2><p>We may use service providers that support hosting, email, analytics, and business operations. We do not sell personal information. We retain information only as reasonably needed for the purposes above and applicable legal obligations.</p>
    <h2>Your choices</h2><p>You can decline optional analytics in the consent prompt. To ask about, correct, or request deletion of information you submitted, email <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> or call <a href={COMPANY.phoneHref}>{COMPANY.phoneDisplay}</a>.</p>
  </LegalPage>;
}

export function Terms() {
  return <LegalPage title="Website Terms of Use">
    <p>Last updated: March 18, 2025</p>
    <p>This website is operated by {COMPANY.legalName}. By using it, you agree to these terms. Website content is general information and is not legal, engineering, architectural, code, or other professional advice.</p>
    <h2>No guarantee of approval or timing</h2><p>Permit requirements and agency timelines vary by jurisdiction and project. Nothing on this site guarantees permit issuance, approval, inspection results, or a particular completion date. Services are governed by a separate written agreement when applicable.</p>
    <h2>Acceptable use and content</h2><p>You may not misuse this site, attempt unauthorized access, disrupt its operation, or copy its content in violation of applicable law. Third-party agency portals and external resources are governed by their own terms.</p>
    <h2>Contact</h2><p>Questions may be directed to {COMPANY.displayName} at <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> or <a href={COMPANY.phoneHref}>{COMPANY.phoneDisplay}</a>.</p>
  </LegalPage>;
}

function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><section className="py-16 bg-zinc-950 text-white"><div className="container mx-auto px-4"><h1 className="text-4xl md:text-5xl font-serif font-bold">{title}</h1></div></section><article className="container mx-auto px-4 py-16 max-w-3xl prose prose-zinc prose-lg"><p className="font-semibold">{COMPANY.displayName}</p>{children}</article></div>;
}