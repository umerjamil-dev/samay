import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { Users, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";
import { getCars } from "@/lib/cars.server";

const getCarsFn = getCars;

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

function FleetPage() {
  const [fleet, setFleet] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFleet = async () => {
      const data = await getCarsFn();
      setFleet(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    fetchFleet();
  }, []);

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
        {loading ? (
          <div className="text-center text-muted-foreground animate-pulse">Scanning our high-end fleet...</div>
        ) : (
          <div className="grid gap-10 md:grid-cols-3">
            {fleet.map((c) => (
              <div key={c.id} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:border-gold hover:shadow-luxury">
                <div className="aspect-[16/10] overflow-hidden bg-black flex items-center justify-center">
                  <img src={c.image_url} alt={c.name} loading="lazy" className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl">{c.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Premium Selection</p>
                    </div>
                    <div className="text-right">
                      <div className="text-gold text-2xl font-semibold">${c.price_per_hour}</div>
                      <div className="text-xs text-muted-foreground">per hour</div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="text-sm font-bold text-gold uppercase tracking-widest">${c.price_per_km} per kilometer</div>
                    <div className="text-xs text-muted-foreground">Base Price: ${c.base_price}</div>
                  </div>
                  <div className="mt-6 flex items-center gap-6 text-sm">
                    <span className="flex items-center gap-2 text-foreground/80"><Users className="h-4 w-4 text-gold" /> {c.passengers} passengers</span>
                    <span className="flex items-center gap-2 text-foreground/80"><Briefcase className="h-4 w-4 text-gold" /> {c.bags} luggage</span>
                  </div>
                  <Link to="/booking" className="mt-6 inline-flex rounded-md border border-gold px-6 py-2.5 text-sm font-semibold text-gold hover:bg-gold hover:text-gold-foreground">
                    Book This Vehicle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
