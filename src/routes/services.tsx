import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { Plane, Building2, Heart, MapPin, Clock, Ship } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Simba Luxury Chauffeur" },
      { name: "description", content: "Airport transfers, corporate travel, weddings, hourly charters, and point-to-point transfers across NYC." },
      { property: "og:title", content: "Simba Luxury Services" },
      { property: "og:description", content: "Premium chauffeur services across NYC and the tri-state area." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { icon: Plane, t: "Airport Transfers", d: "On-time pickups and drop-offs at JFK, LaGuardia, Newark, Teterboro, and Long Island MacArthur. Real-time flight tracking included." },
  { icon: Building2, t: "Corporate Travel", d: "Executive transportation, roadshows, and client hosting with billing for teams of any size." },
  { icon: Heart, t: "Weddings & Events", d: "Make a memorable arrival. Bridal party transport, prom, anniversaries, and red-carpet events." },
  { icon: MapPin, t: "Point-to-Point", d: "Direct rides between NYC and Atlantic City, the Hamptons, Philadelphia, Boston, and beyond." },
  { icon: Clock, t: "Hourly Charters", d: "Keep a chauffeur and vehicle on standby for shopping, meetings, dining, or city tours." },
  { icon: Ship, t: "Cruise Terminals", d: "Premium service to Manhattan, Brooklyn, Bayonne, and Cape Liberty cruise terminals." },
];

function ServicesPage() {
  return (
    <Layout>
      <section className="border-b border-border/40 bg-card/40">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">Services</span>
          <h1 className="mt-3 max-w-3xl text-5xl md:text-6xl">Tailored for every journey.</h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Whether you're flying out before sunrise or hosting an executive in town for the day, we've got the right vehicle and chauffeur for the moment.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.t} className="group rounded-2xl border border-border bg-card p-8 transition hover:border-gold hover:shadow-luxury">
              <s.icon className="h-10 w-10 text-gold" />
              <h3 className="mt-6 text-2xl">{s.t}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl">Don't see what you need?</h2>
          <p className="mt-3 text-muted-foreground">We custom-tailor every ride. Tell us what you're planning.</p>
          <Link to="/contact" className="mt-8 inline-flex rounded-md bg-gradient-gold px-8 py-4 font-semibold text-gold-foreground shadow-gold hover:scale-105 transition-transform">
            Get a Custom Quote
          </Link>
        </div>
      </section>
    </Layout>
  );
}
