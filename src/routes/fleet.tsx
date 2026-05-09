import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { Users, Briefcase } from "lucide-react";
import sedan from "@/assets/sedan.jpg";
import suv from "@/assets/suv.jpg";
import limo from "@/assets/limo.jpg";
import van from "@/assets/van.jpg";

export const Route = createFileRoute("/fleet")({
  head: () => ({
    meta: [
      { title: "Our Fleet — Simba Luxury" },
      { name: "description", content: "Late-model luxury sedans, SUVs, stretch limousines, and Sprinter vans for every occasion." },
      { property: "og:title", content: "Simba Luxury Fleet" },
      { property: "og:description", content: "Mercedes S-Class, Cadillac Escalade, stretch limos, and Sprinter vans." },
    ],
  }),
  component: FleetPage,
});

const fleet = [
  { img: sedan, t: "Luxury Sedan", model: "Mercedes-Benz S-Class", p: 125, cap: 3, lug: 3, d: "Elegant travel for executives and couples seeking style and comfort." },
  { img: suv, t: "Luxury SUV", model: "Cadillac Escalade", p: 95, cap: 6, lug: 6, d: "Maximum comfort for larger groups and family trips." },
  { img: limo, t: "Stretch Limousine", model: "Chrysler 300 Stretch", p: 175, cap: 8, lug: 4, d: "Make a statement at weddings, proms, or special evenings." },
  { img: van, t: "Sprinter Van", model: "Mercedes Sprinter", p: 150, cap: 12, lug: 12, d: "Spacious shuttle for corporate groups and large families." },
];

function FleetPage() {
  return (
    <Layout>
      <section className="border-b border-border/40 bg-card/40">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">Our Fleet</span>
          <h1 className="mt-3 max-w-3xl text-5xl md:text-6xl">A vehicle for every occasion.</h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Every car in our fleet is meticulously maintained, professionally detailed, and stocked with complimentary water and chargers.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-10 md:grid-cols-2">
          {fleet.map((c) => (
            <div key={c.t} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:border-gold hover:shadow-luxury">
              <div className="aspect-[16/10] overflow-hidden bg-black">
                <img src={c.img} alt={c.t} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl">{c.t}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{c.model}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-gold text-2xl font-semibold">${c.p}</div>
                    <div className="text-xs text-muted-foreground">per hour</div>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">{c.d}</p>
                <div className="mt-6 flex items-center gap-6 text-sm">
                  <span className="flex items-center gap-2 text-foreground/80"><Users className="h-4 w-4 text-gold" /> {c.cap} passengers</span>
                  <span className="flex items-center gap-2 text-foreground/80"><Briefcase className="h-4 w-4 text-gold" /> {c.lug} luggage</span>
                </div>
                <Link to="/booking" className="mt-6 inline-flex rounded-md border border-gold px-6 py-2.5 text-sm font-semibold text-gold hover:bg-gold hover:text-gold-foreground">
                  Book This Vehicle
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
