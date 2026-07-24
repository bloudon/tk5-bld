import React from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import logoSrc from "../assets/logo.png";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Pricing", href: "/pricing" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-visible">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-28 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center group" data-testid="link-nav-logo">
                <img
                  src={logoSrc}
                  alt="Team K5 Permitting Services"
                  className="h-36 w-auto object-contain drop-shadow-md transition-opacity group-hover:opacity-90"
                />
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <a href="https://pflow.permitsmanager.com/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="font-semibold" data-testid="button-login">
                  Login
                </Button>
              </a>
              <Link href="/contact" className="ml-2">
                <Button variant="default" size="sm" className="font-semibold shadow-sm">
                  Get a Quote
                </Button>
              </Link>
            </nav>

            <div className="md:hidden flex items-center">
              <button
                className="p-2 text-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-20 z-40 bg-background border-t">
          <div className="px-4 pt-4 pb-6 space-y-1 sm:px-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-4 text-base font-medium rounded-md ${
                  location === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4">
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full justify-center">Get a Quote</Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">{children}</main>

      <footer className="bg-zinc-950 text-zinc-300 py-16 border-t border-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="mb-6">
                <Link href="/" data-testid="link-footer-logo">
                  <img
                    src={logoSrc}
                    alt="Team K5 Permitting Services"
                    className="h-20 w-auto object-contain opacity-95 hover:opacity-100 transition-opacity"
                  />
                </Link>
              </div>
              <p className="text-sm leading-relaxed max-w-sm mb-8 text-zinc-400">
                Founded by a former building official, providing expert permit expediting, inspection scheduling, and e-recording services since 2003. We know how the system works from the inside out.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>(407) 469-5599</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-serif font-bold text-lg text-white mb-6">Offices</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Clermont, FL<br/><span className="text-zinc-500 text-xs">Serving Central Florida</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Brandon, FL<br/><span className="text-zinc-500 text-xs">Serving Tampa Bay Area</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Lake Worth, FL<br/><span className="text-zinc-500 text-xs">Serving South Florida</span></span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-white mb-6">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="hover:text-primary transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>© {new Date().getFullYear()} Team K5 Construction and Development Coordination. All rights reserved.</p>
            <p>Serving the Southeast USA & Nationally</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
