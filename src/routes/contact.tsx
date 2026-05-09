import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Simba Luxury" },
      { name: "description", content: "Get in touch with Simba Luxury for quotes, custom rides, or 24/7 support." },
      { property: "og:title", content: "Contact Simba Luxury" },
      { property: "og:description", content: "Call, email, or message us — we respond within an hour." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <Layout>
      <section className="border-b border-border/40 bg-card/40">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">Contact</span>
          <h1 className="mt-3 max-w-3xl text-5xl md:text-6xl">Let's plan your next ride.</h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-2">
        <div>
          <h2 className="text-3xl">Get in touch</h2>
          <p className="mt-4 text-muted-foreground">
            Reach our 24/7 dispatch team for quotes, custom routes, or last-minute reservations. We respond within the hour.
          </p>
          <div className="mt-10 space-y-6">
            {[
              { icon: Phone, t: "Phone", d: "+1 (888) 711-5065", href: "tel:+18887115065" },
              { icon: Mail, t: "Email", d: "hello@simbaluxury.com", href: "mailto:hello@simbaluxury.com" },
              { icon: MapPin, t: "Location", d: "Massapequa, NY 11758" },
              { icon: Clock, t: "Hours", d: "24 hours · 7 days a week" },
            ].map((c) => (
              <div key={c.t} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
                <div className="rounded-lg bg-gold/10 p-3"><c.icon className="h-5 w-5 text-gold" /></div>
                <div>
                  <div className="text-sm uppercase tracking-wider text-muted-foreground">{c.t}</div>
                  {c.href ? <a href={c.href} className="text-lg hover:text-gold">{c.d}</a> : <div className="text-lg">{c.d}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="rounded-2xl border border-border bg-card p-8"
        >
          <h2 className="text-2xl">Send us a message</h2>
          <div className="mt-6 grid gap-4">
            <Field label="Full Name" name="name" required />
            <Field label="Email" name="email" type="email" required />
            <Field label="Phone" name="phone" type="tel" />
            <div>
              <label className="mb-2 block text-sm text-muted-foreground">Message</label>
              <textarea required rows={5} className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground outline-none focus:border-gold" />
            </div>
            <button type="submit" className="rounded-md bg-gradient-gold px-6 py-3 font-semibold text-gold-foreground shadow-gold hover:scale-[1.02] transition-transform">
              {sent ? "Thanks — we'll be in touch!" : "Send Message"}
            </button>
          </div>
        </form>
      </section>
    </Layout>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-muted-foreground">{label}</label>
      <input name={name} type={type} required={required} className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground outline-none focus:border-gold" />
    </div>
  );
}
