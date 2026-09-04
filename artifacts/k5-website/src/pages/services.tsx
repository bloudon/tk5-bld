import { motion } from "framer-motion";
import { Link } from "wouter";
import { FileText, ClipboardCheck, Building2, ArrowRight, ScrollText, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Services() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-20 bg-zinc-950 text-white relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2831&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Our Services</h1>
            <p className="text-xl text-zinc-400 font-light leading-relaxed">
              Comprehensive permit expediting, coordination, and recording services built on two decades of insider knowledge.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          <nav aria-label="Detailed permit services" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Permit Expediting", "/services/permit-expediting"],
              ["Commercial Expediting", "/services/commercial-permit-expediting"],
              ["Residential Expediting", "/services/residential-permit-expediting"],
              ["Inspection Scheduling", "/services/inspection-scheduling"],
              ["E-Recording & NOC", "/services/e-recording-notice-of-commencement"],
              ["Multi-Site Coordination", "/services/multi-site-permit-coordination"],
            ].map(([label, href]) => <Link key={href} href={href} className="border border-border p-5 font-bold text-primary hover:border-primary">{label}<ArrowRight className="ml-2 inline h-4 w-4"/></Link>)}
          </nav>
          
          {/* Service 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <div className="bg-primary/10 w-16 h-16 flex items-center justify-center mb-6">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-foreground">Permit Expediting</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                The permit process is the most common bottleneck in any construction timeline. We eliminate the friction by preparing, auditing, and managing your submittals from day one to issuance.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-foreground"><strong>Pre-submittal Audits:</strong> We review your package to ensure it meets specific municipal requirements before it ever hits a reviewer's desk.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-foreground"><strong>Status Tracking:</strong> Continuous monitoring of your application status with proactive follow-ups on comments or holds.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-foreground"><strong>Comment Resolution:</strong> When reviewers ask for clarification, we help translate their requests and coordinate the necessary responses quickly.</span>
                </li>
              </ul>
              <Link href="/pricing">
                <Button variant="outline" className="rounded-none h-12 px-6">View Pricing</Button>
              </Link>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 bg-zinc-100 h-80 lg:h-full min-h-[400px] relative border border-zinc-200 p-2"
            >
              <div className="w-full h-full bg-zinc-200/50 flex items-center justify-center">
                 <img src="https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=2787&auto=format&fit=crop" className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80" alt="Architectural drawings" />
              </div>
            </motion.div>
          </div>

          <div className="w-full h-px bg-border"></div>

          {/* Service 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-zinc-100 h-80 lg:h-full min-h-[400px] relative border border-zinc-200 p-2"
            >
              <div className="w-full h-full bg-zinc-200/50 flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80" alt="Construction site inspection" />
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-primary/10 w-16 h-16 flex items-center justify-center mb-6">
                <ClipboardCheck className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-foreground">Inspection Scheduling</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                A project that sits waiting for an inspector is bleeding money. We manage the delicate logistics of inspection coordination to keep your job site active and compliant.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-foreground"><strong>Strategic Sequencing:</strong> We sequence your inspection requests based on our knowledge of how specific departments route their personnel.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-foreground"><strong>Liaison Services:</strong> Acting as the point of contact between your site superintendent and the municipal inspector.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-foreground"><strong>Violation Management:</strong> If an inspection fails, we help you understand exactly what the inspector needs to see for a successful re-inspection.</span>
                </li>
              </ul>
              <Link href="/contact">
                <Button variant="outline" className="rounded-none h-12 px-6">Discuss Your Project</Button>
              </Link>
            </motion.div>
          </div>

          <div className="w-full h-px bg-border"></div>

          {/* Service 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <div className="bg-primary/10 w-16 h-16 flex items-center justify-center mb-6">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-foreground">E-Recording Services</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Modern construction requires modern document management. We handle the digital recording of crucial legal documents securely, quickly, and compliantly.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-foreground"><strong>Notice of Commencement (NOC):</strong> Fast, accurate recording of NOCs so your project can break ground legally.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-foreground"><strong>Terminations & Releases:</strong> Proper handling of NOC terminations and lien releases to keep your titles clean.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-foreground"><strong>Rapid Turnaround:</strong> Because we submit electronically, documents that used to take days are often recorded in hours.</span>
                </li>
              </ul>
              <Link href="/pricing">
                <Button variant="outline" className="rounded-none h-12 px-6">View E-Recording Rates</Button>
              </Link>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 bg-zinc-100 h-80 lg:h-full min-h-[400px] relative border border-zinc-200 p-2"
            >
              <div className="w-full h-full bg-zinc-200/50 flex items-center justify-center">
                 <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2940&auto=format&fit=crop" className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80" alt="Legal documents" />
              </div>
            </motion.div>
          </div>

          <div className="w-full h-px bg-border"></div>

          {/* Service 4 — Traditional Notary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <div className="bg-primary/10 w-16 h-16 flex items-center justify-center mb-6">
                <ScrollText className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-foreground">Traditional Notary</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Many construction and real estate documents require notarization before they can be recorded or submitted. Our notary coordination covers everything from Notices of Commencement to lien releases and affidavits — with the same fast turnaround you expect from Team K5.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-foreground"><strong>Signing coordination:</strong> Contact us to confirm current in-person notary availability for the Clermont, Brandon, or Lake Worth service areas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-foreground"><strong>Construction Documents:</strong> Specialized expertise in the notarization requirements for NOCs, subcontractor agreements, and lien waivers.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-foreground"><strong>Same-Day Service:</strong> Walk-ins welcome during business hours. For high-volume clients, we offer priority scheduling.</span>
                </li>
              </ul>
              <Link href="/contact">
                <Button variant="outline" className="rounded-none h-12 px-6">Schedule an Appointment</Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 bg-zinc-100 h-80 lg:h-full min-h-[400px] relative border border-zinc-200 p-2"
            >
              <div className="w-full h-full bg-zinc-200/50 flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2942&auto=format&fit=crop" className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80" alt="Notary signing documents" />
              </div>
            </motion.div>
          </div>

          <div className="w-full h-px bg-border"></div>

          {/* Service 5 — Remote Online Notary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-zinc-100 h-80 lg:h-full min-h-[400px] relative border border-zinc-200 p-2"
            >
              <div className="w-full h-full bg-zinc-200/50 flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1609921212029-bb5a28e60960?q=80&w=2952&auto=format&fit=crop" className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80" alt="Video call for remote notary" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-primary/10 w-16 h-16 flex items-center justify-center mb-6">
                <Video className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-foreground">Remote Online Notary</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Florida law authorizes Remote Online Notarization (RON), allowing signers anywhere in the world to execute documents with a Florida-commissioned notary over a secure audio-visual connection. No travel, no delays — just a legally valid notarization from your desk.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-foreground"><strong>Statewide & National Reach:</strong> Signers can be located anywhere — Florida RON law applies to the notary's location, not the signer's.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-foreground"><strong>Tamper-Evident Digital Seal:</strong> Documents are sealed with a digital certificate and a compliant electronic notary seal that satisfies county recorder requirements.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-foreground"><strong>Audit Trail:</strong> Every RON session is recorded and stored per Florida statute, providing ironclad documentation for closing and litigation purposes.</span>
                </li>
              </ul>
              <Link href="/contact">
                <Button variant="outline" className="rounded-none h-12 px-6">Book a RON Session</Button>
              </Link>
            </motion.div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-zinc-100 border-t border-zinc-200 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-zinc-900 mb-6">Ready to streamline your permits?</h2>
          <Link href="/contact">
            <Button size="lg" className="bg-primary text-primary-foreground h-14 px-8 rounded-none shadow-sm">
              Contact Team K5 <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
