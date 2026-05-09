import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { Award, Users, Globe2 } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Simba Luxury Chauffeur Service" },
      { name: "description", content: "Family-run NYC chauffeur company delivering reliable, luxurious black car service since 2023." },
      { property: "og:title", content: "About Simba Luxury" },
      { property: "og:description", content: "NYC's trusted chauffeur company." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <Layout>
      <section className="border-b border-border/40 bg-card/40">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">About Us</span>
          <h1 className="mt-3 max-w-3xl text-5xl md:text-6xl">New York's trusted chauffeur company.</h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Simba Luxury was built on a simple promise: deliver every passenger to their destination on time,
            in immaculate comfort, with the discretion you expect from a five-star service.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-4xl">Our Story</h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Founded in Massapequa, NY, Simba Luxury serves discerning travelers across Manhattan, Long Island,
              Newark, and the broader tri-state area. From late-night airport pickups to weddings and corporate roadshows,
              every ride is treated as the most important journey of the day.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Our chauffeurs are professionally trained, background-checked, and obsessed with the details —
              the temperature of the cabin, the bottle of cold water in the cupholder, the route that avoids the inevitable bridge traffic.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { n: "10,000+", l: "Rides delivered" },
              { n: "4.9 ★", l: "Average rating" },
              { n: "150+", l: "Repeat clients/mo" },
              { n: "24/7", l: "Dispatch" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-border bg-card p-6">
                <div className="font-display text-3xl text-gold">{s.n}</div>
                <div className="mt-2 text-sm text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-4xl">What we stand for.</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Award, t: "Excellence", d: "Every detail matters — from punctuality to interior cleanliness." },
              { icon: Users, t: "Hospitality", d: "Discreet, courteous chauffeurs trained to anticipate your needs." },
              { icon: Globe2, t: "Reliability", d: "Real-time flight tracking and 24/7 dispatch you can count on." },
            ].map((v) => (
              <div key={v.t} className="rounded-2xl border border-border bg-background p-8">
                <v.icon className="h-10 w-10 text-gold" />
                <h3 className="mt-6 text-2xl">{v.t}</h3>
                <p className="mt-3 text-muted-foreground">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-4xl">Experience the difference.</h2>
        <Link to="/booking" className="mt-8 inline-flex rounded-md bg-gradient-gold px-8 py-4 font-semibold text-gold-foreground shadow-gold hover:scale-105 transition-transform">
          Book a Ride
        </Link>
      </section>
    </Layout>
  );
}
