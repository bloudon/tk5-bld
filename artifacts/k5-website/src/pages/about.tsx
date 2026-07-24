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
    <div className="flex flex-col min-h-screen pt-20">
      <section className="py-20 bg-zinc-950 text-white relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888081622-1bb5924ddc79?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Our Story</h1>
            <p className="text-xl text-zinc-400 font-light leading-relaxed">
              Founded by a former building official, Team K5 operates on a simple premise: to navigate the bureaucracy, you need to understand it from the inside out.
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
              <h2 className="font-serif text-3xl font-bold text-foreground">The Foundation: Don Kirby</h2>
              <p>
                In 2003, Don Kirby decided to change sides. After a long and successful career serving as a building official and inspector for multiple municipalities across the state of Florida, he had seen it all. He had seen contractors lose thousands of dollars on delayed projects, not because their work was poor, but because their paperwork was flawed.
              </p>
              <p>
                He watched companies struggle to communicate with municipal departments, missing minor details that would send their permit applications straight to the bottom of the pile. Don knew the system intimately — he knew what reviewers looked for, what triggered red flags, and how the internal timelines functioned.
              </p>
              <p>
                He founded Team K5 Construction and Development Coordination to bridge the massive gap between the construction industry and municipal government. The firm quickly became the secret weapon for developers and contractors who wanted their projects to move without friction.
              </p>
              
              <h2 className="font-serif text-3xl font-bold text-foreground mt-12">The Next Generation: Brian Kirby</h2>
              <p>
                Today, Team K5 is run by Don's son, Brian Kirby. Growing up in the business, Brian absorbed the insider knowledge and technical expertise required to navigate increasingly complex modern building codes and digital submittal systems.
              </p>
              <p>
                Under Brian's leadership, Team K5 has expanded to three offices across Florida, serving clients throughout the Southeast United States and nationally. While the technology has changed — moving from paper plans to complex e-recording and digital portals — the core philosophy remains identical: we think like the building department so our clients don't have to.
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
                <h3 className="font-serif text-2xl font-bold mb-6 text-zinc-900">Our Florida Offices</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-3 shrink-0 h-fit">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 text-lg">Clermont</h4>
                      <p className="text-zinc-600 text-sm mt-1">Serving Central Florida and National Coordination.</p>
                      <p className="text-zinc-800 text-sm font-semibold mt-2">Jon Thomas, Office Manager</p>
                      <div className="flex flex-col gap-1 mt-1">
                        <a href="tel:4073786682" className="text-primary text-sm hover:underline">(407) 378-6682</a>
                        <a href="mailto:jon.thomas@expeditepermit.com" className="text-primary text-sm hover:underline">jon.thomas@expeditepermit.com</a>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-3 shrink-0 h-fit">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 text-lg">Brandon</h4>
                      <p className="text-zinc-600 text-sm mt-1">Serving the greater Tampa Bay area and Gulf Coast.</p>
                      <p className="text-zinc-800 text-sm font-semibold mt-2">John Christianson, Office Manager</p>
                      <div className="flex flex-col gap-1 mt-1">
                        <a href="tel:8135356060" className="text-primary text-sm hover:underline">(813) 535-6060</a>
                        <a href="mailto:john.christianson@expeditepermit.com" className="text-primary text-sm hover:underline">john.christianson@expeditepermit.com</a>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-3 shrink-0 h-fit">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 text-lg">Lake Worth</h4>
                      <p className="text-zinc-600 text-sm mt-1">Serving South Florida and the Atlantic Coast.</p>
                      <p className="text-zinc-800 text-sm font-semibold mt-2">Wendy Breakwell, Office Manager</p>
                      <div className="flex flex-col gap-1 mt-1">
                        <a href="tel:9543807999" className="text-primary text-sm hover:underline">(954) 380-7999</a>
                        <a href="mailto:wendy.breakwell@expeditepermit.com" className="text-primary text-sm hover:underline">wendy.breakwell@expeditepermit.com</a>
                      </div>
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
