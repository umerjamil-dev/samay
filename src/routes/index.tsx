import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { ArrowRight, ShieldCheck, Clock, Star, Plane, Building2, Heart, MapPin } from "lucide-react";
import { BookingWidget } from "@/components/site/BookingWidget";
import { useState, useEffect } from "react";
import { getHomeCars } from "@/lib/cars.server";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Simba Luxury — NYC Black Car & Chauffeur Service" },
      { name: "description", content: "Premium chauffeur service in New York. Airport transfers, corporate travel, weddings, and hourly charters. 24/7 booking." },
      { property: "og:title", content: "Simba Luxury — NYC Black Car & Chauffeur Service" },
      { property: "og:description", content: "Premium chauffeur service in New York. 24/7 luxury transportation." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [fleet, setFleet] = useState<any[]>([]);

  useEffect(() => {
    getHomeCars().then(data => setFleet(Array.isArray(data) ? data : []));
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src={hero} alt="Luxury black sedan in NYC" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <span className="mb-6 inline-block rounded-full border border-gold/40 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-gold">
            New York · 24/7 Available
          </span>
          <h1 className="max-w-3xl font-display text-5xl leading-tight text-foreground md:text-6xl lg:text-7xl">
            Arrive in <span className="text-gold">Effortless</span> Luxury.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Chauffeured black car service for executives, travelers, and special occasions across NYC, NJ, and the tri-state area.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/booking" className="group flex items-center gap-2 rounded-md bg-gradient-gold px-7 py-3.5 font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-105">
              Reserve Your Ride <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/fleet" className="rounded-md border border-border bg-background/30 px-7 py-3.5 font-semibold backdrop-blur hover:border-gold hover:text-gold">
              View Fleet
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { n: "10K+", l: "Rides" },
              { n: "4.9★", l: "Rated" },
              { n: "24/7", l: "Support" },
              { n: "100%", l: "On-Time" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-3xl text-gold">{s.n}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Widget — full width below hero */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-gold">Reserve Now</span>
            <h2 className="mt-3 text-4xl md:text-5xl">Book your chauffeur in seconds.</h2>
          </div>
          <BookingWidget />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 max-w-2xl">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">Why Simba</span>
          <h2 className="mt-3 text-4xl md:text-5xl">A standard above the rest.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: ShieldCheck, t: "Vetted Chauffeurs", d: "Professionally trained, background-checked, and discreet." },
            { icon: Clock, t: "Always On Time", d: "Real-time flight tracking and dispatch with on-time guarantee." },
            { icon: Star, t: "First-Class Fleet", d: "Late-model black sedans, SUVs, vans, and stretch limousines." },
          ].map((f) => (
            <div key={f.t} className="group rounded-2xl border border-border bg-card p-8 transition hover:border-gold hover:shadow-luxury">
              <f.icon className="h-10 w-10 text-gold" />
              <h3 className="mt-6 text-2xl">{f.t}</h3>
              <p className="mt-3 text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="bg-card/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-gold">Services</span>
              <h2 className="mt-3 text-4xl md:text-5xl">Tailored for every journey.</h2>
            </div>
            <Link to="/services" className="text-gold hover:underline">All services →</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Plane, t: "Airport Transfers", d: "JFK · LGA · EWR · TEB" },
              { icon: Building2, t: "Corporate Travel", d: "Executive & roadshow" },
              { icon: Heart, t: "Weddings & Events", d: "Memorable arrivals" },
              { icon: MapPin, t: "Point-to-Point", d: "NYC · Hamptons · AC" },
            ].map((s) => (
              <div key={s.t} className="rounded-2xl border border-border bg-background p-6 transition hover:border-gold">
                <s.icon className="h-8 w-8 text-gold" />
                <h3 className="mt-5 text-xl">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet preview */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 max-w-2xl">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">Our Fleet</span>
          <h2 className="mt-3 text-4xl md:text-5xl">Choose your ride.</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {fleet.map((c) => (
            <div key={c.id} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:border-gold hover:shadow-luxury">
              <div className="aspect-[16/10] overflow-hidden bg-black flex items-center justify-center">
                <img src={c.image_url} alt={c.name} loading="lazy" className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="flex items-center justify-between p-6">
                <div>
                  <h3 className="text-2xl">{c.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.passengers} Passengers · {c.bags} Bags</p>
                </div>
                <div className="text-right">
                  <div className="text-gold text-2xl font-semibold">${c.price_per_hour}</div>
                  <div className="text-xs text-muted-foreground">per hour</div>
                </div>
              </div>
            </div>
          ))}
          {fleet.length === 0 && (
            <div className="md:col-span-2 text-center text-muted-foreground py-10 italic">
              Loading our premium fleet...
            </div>
          )}
        </div>
        <div className="mt-10 text-center">
          <Link to="/fleet" className="rounded-md border border-gold px-7 py-3 font-semibold text-gold hover:bg-gold hover:text-gold-foreground">
            Explore Full Fleet
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-card/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 max-w-2xl">
            <span className="text-xs uppercase tracking-[0.3em] text-gold">Testimonials</span>
            <h2 className="mt-3 text-4xl md:text-5xl">What our clients say.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { q: "Spotless car, on time, the chauffeur was waiting at baggage claim. 10/10.", n: "M. Umer" },
              { q: "I travel between EWR and JFK weekly. Two years with Simba — never a single delay.", n: "M. Ali" },
              { q: "Amazing experience. Easy booking, professional driver, and a luxurious ride.", n: "S. Hamza" },
            ].map((t) => (
              <div key={t.n} className="rounded-2xl border border-border bg-background p-8">
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mt-4 text-foreground/90 italic">"{t.q}"</p>
                <div className="mt-6 text-sm font-semibold text-gold">{t.n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-3xl border border-gold/30 bg-gradient-to-br from-card to-background p-12 text-center md:p-20">
          <h2 className="text-4xl md:text-5xl">Ready to ride in style?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Reserve in under a minute. Cancel free up to 24 hours before pickup.
          </p>
          <Link to="/booking" className="mt-8 inline-flex items-center gap-2 rounded-md bg-gradient-gold px-8 py-4 font-semibold text-gold-foreground shadow-gold hover:scale-105 transition-transform">
            Book Your Chauffeur <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
