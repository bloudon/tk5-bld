import { motion } from "framer-motion";
import { Link } from "wouter";
import { Check, ArrowRight, Info, FileText, Building2, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const permitFactors = [
  "Municipality and jurisdiction complexity",
  "Project type (residential, commercial, mixed-use)",
  "Scope and number of trade permits required",
  "Volume — contractors with ongoing work receive preferred rates",
  "Timeline requirements and urgency",
];

const permitIncludes = [
  "Pre-submittal package audit",
  "Submittal preparation & submission",
  "Continuous status tracking",
  "Comment & correction resolution",
  "Direct communication with your team",
];

export default function Pricing() {
  return (
    <div className="flex flex-col min-h-screen pt-20">
      <section className="py-20 bg-zinc-950 text-white relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888081622-1bb5924ddc79?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Transparent Pricing</h1>
            <p className="text-xl text-zinc-400 font-light leading-relaxed">
              Flat rates where the work is predictable. Custom quotes where every project is different. No surprises either way.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

          <div className="bg-blue-50 border border-blue-200 p-4 mb-16 flex items-start gap-3 text-blue-900">
            <Info className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">
              <strong>Pass-through costs:</strong> Building department fees, municipal charges, and recording costs are billed at actual cost — they are never marked up.
            </p>
          </div>

          {/* Permit Expediting */}
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 w-10 h-10 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-foreground">Permit Expediting</h2>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Every contractor's operation is different. Our fees are tailored to your volume, project types, and the jurisdictions you work in — so you only pay for what your work actually requires.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Factors */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-zinc-950 text-white p-8"
              >
                <h3 className="text-lg font-serif font-bold mb-2">What affects your quote</h3>
                <p className="text-zinc-400 text-sm mb-6">We look at these factors to build a fee that makes sense for your business:</p>
                <ul className="space-y-3">
                  {permitFactors.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span className="text-zinc-200">{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-xs text-zinc-500 italic">Contractors with consistent volume typically qualify for a retainer-style arrangement with reduced per-permit fees.</p>
              </motion.div>

              {/* What's included */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="border border-border p-8 flex flex-col"
              >
                <h3 className="text-lg font-serif font-bold text-foreground mb-2">Always included</h3>
                <p className="text-muted-foreground text-sm mb-6">Regardless of project size or fee structure, every permit engagement includes:</p>
                <ul className="space-y-3 flex-1">
                  {permitIncludes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">Ready to discuss your project load? We'll turn around a quote quickly.</p>
                  <Link href="/contact">
                    <Button className="w-full rounded-none h-12 bg-primary text-primary-foreground">
                      Request a Quote <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="w-full h-px bg-border mb-20" />

          {/* E-Recording */}
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 w-10 h-10 flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-foreground">E-Recording Services</h2>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Electronic recording of Notices of Commencement, terminations, lien releases, and other legal project documents. Flat rates — no surprises.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0 }}
                className="border border-border p-6 bg-card"
              >
                <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide font-semibold">Single Page Document</p>
                <p className="text-4xl font-serif font-bold text-foreground">$44.95</p>
                <p className="text-xs text-muted-foreground mt-2 italic">+ actual recording cost</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="border border-border p-6 bg-card"
              >
                <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide font-semibold">Each Additional Page</p>
                <p className="text-4xl font-serif font-bold text-foreground">$10</p>
                <p className="text-xs text-muted-foreground mt-2 italic">per page beyond the first</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-zinc-950 text-white p-6 flex flex-col justify-between"
              >
                <div>
                  <p className="text-sm text-zinc-400 mb-2 uppercase tracking-wide font-semibold">Recording Costs</p>
                  <p className="text-zinc-200 text-sm leading-relaxed">County recording fees are passed through at exact cost — never marked up.</p>
                </div>
                <div className="mt-6">
                  <a href="https://erecording-fl.com" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90">Submit Documents ↗</Button>
                  </a>
                  <p className="text-xs text-zinc-500 mt-2 text-center">Opens our sister site, erecording-fl.com</p>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="w-full h-px bg-border mb-20" />

          {/* Inspection Scheduling */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 w-10 h-10 flex items-center justify-center shrink-0">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-foreground">Inspection Scheduling</h2>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Inspection coordination fees are included in permit engagements or available as a standalone service. Pricing depends on the frequency and municipalities involved.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border border-border p-8 bg-card flex flex-col md:flex-row items-start md:items-center gap-8"
            >
              <div className="flex-1">
                <h3 className="font-serif font-bold text-foreground text-lg mb-2">Bundled or standalone</h3>
                <p className="text-muted-foreground text-sm">
                  If we're already handling your permits, inspection scheduling is typically bundled at no additional charge. For standalone inspection management, reach out and we'll build a rate around your volume and locations.
                </p>
              </div>
              <Link href="/contact" className="shrink-0">
                <Button variant="outline" className="rounded-none h-12 px-6 whitespace-nowrap">
                  Discuss Your Needs <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

        </div>
      </section>
    </div>
  );
}
