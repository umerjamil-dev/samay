import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <div className="font-display text-2xl font-bold text-gold">SIMBA LUXURY</div>
          <p className="mt-4 text-sm text-muted-foreground">
            Premium chauffeur and black car service across New York, New Jersey, and beyond.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#" className="rounded-full border border-border p-2 hover:border-gold hover:text-gold"><Instagram className="h-4 w-4" /></a>
            <a href="#" className="rounded-full border border-border p-2 hover:border-gold hover:text-gold"><Facebook className="h-4 w-4" /></a>
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-gold">About Us</Link></li>
            <li><Link to="/services" className="hover:text-gold">Services</Link></li>
            <li><Link to="/fleet" className="hover:text-gold">Our Fleet</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">Services</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Airport Transfers</li>
            <li>Corporate Travel</li>
            <li>Weddings & Events</li>
            <li>Hourly Charters</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">Contact</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-gold" /> <span>+1 (888) 711-5065</span></li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-gold" /> <span>hello@simbaluxury.com</span></li>
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-gold" /> <span>Massapequa, NY 11758</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Simba Luxury. All rights reserved.
      </div>
    </footer>
  );
}
