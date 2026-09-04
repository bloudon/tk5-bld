import { motion } from "framer-motion";
import { Link } from "wouter";
import { Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-20 bg-zinc-950 text-white relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888081622-1bb5924ddc79?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Our Story</h1>
            <p className="text-xl text-zinc-400 font-light leading-relaxed">
              Team K5 Construction &amp; Development Coordination operates on a simple premise: to navigate the bureaucracy, you need to understand it from the inside out.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="prose prose-lg prose-zinc dark:prose-invert max-w-none"
            >
              <h2 className="font-serif text-3xl font-bold text-foreground">Built on Municipal Experience</h2>
              <p>
                Team K5 was founded in 2003 by a former building official and inspector with experience in Florida municipalities. That perspective showed how often projects can be delayed not because of the work itself, but because paperwork is incomplete or inconsistent.
              </p>
              <p>
                That municipal experience shaped a process focused on what reviewers look for, what triggers administrative issues, and how review timelines function.
              </p>
              <p>
                Team K5 Construction and Development Coordination, LLC was created to bridge the gap between the construction industry and municipal government.
              </p>
              
              <h2 className="font-serif text-3xl font-bold text-foreground mt-12">Construction Coordination Today</h2>
              <p>
                Today, the company applies its permitting knowledge to increasingly complex building codes and digital submittal systems.
              </p>
              <p>
                Team K5 Construction &amp; Development Coordination serves clients throughout the Southeast United States and nationally. While the technology has changed — moving from paper plans to complex e-recording and digital portals — the core philosophy remains identical: we think like the building department so our clients don't have to.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8 sticky top-32"
            >
              <div className="bg-zinc-50 border border-zinc-200 p-8">
                <h3 className="font-serif text-2xl font-bold mb-6 text-zinc-900">Florida Service Areas</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-3 shrink-0 h-fit">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 text-lg">Clermont</h4>
                       <p className="text-zinc-600 text-sm mt-1">Service area for Central Florida and national coordination.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-3 shrink-0 h-fit">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 text-lg">Brandon</h4>
                       <p className="text-zinc-600 text-sm mt-1">Service area for greater Tampa Bay and the Gulf Coast.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-3 shrink-0 h-fit">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 text-lg">Lake Worth</h4>
                       <p className="text-zinc-600 text-sm mt-1">Service area for South Florida and the Atlantic Coast.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-zinc-200">
                  <p className="text-sm font-semibold text-zinc-900 uppercase tracking-widest mb-4">National Reach</p>
                  <p className="text-zinc-600 text-sm mb-6">While our physical presence is rooted in Florida, our expertise scales. We handle coordination and expediting for clients across the Southeast and nationally.</p>
                  <Link href="/contact">
                    <Button className="w-full bg-primary text-primary-foreground rounded-none h-12 shadow-sm">
                      Contact Us <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
