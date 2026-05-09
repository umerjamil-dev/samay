import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { useState, useEffect } from "react";
import { CheckCircle2, ArrowLeft, Users, Briefcase, ChevronRight, MapPin, Clock, Calendar, Star, Shield, Zap } from "lucide-react";
import { createBooking } from "@/lib/bookings.server";
import { getCars } from "@/lib/cars.server";

// ==========================================
// CLIENT PAYMENT SETTINGS (UPDATE THESE WHEN CLIENT PROVIDES THEM)
// ==========================================
const ZELLE_EMAIL = "payments@simbaluxury.com";
const ZELLE_PHONE = "+1 (555) 123-4567";
// If they provide a direct QR URL or image path, update this string:
const ZELLE_QR_IMAGE = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ZELLE_EMAIL)}`;
// ==========================================

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book a Ride — Simba Luxury" },
      { name: "description", content: "Reserve your luxury chauffeur in under a minute." },
      { property: "og:title", content: "Book Your Chauffeur" },
      { property: "og:description", content: "Reserve a Simba Luxury black car in under a minute." },
    ],
  }),
  component: BookingPage,
});

function BookingPage() {
  const search: any = useSearch({ from: "/booking" });
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [passengers, setPassengers] = useState("1");
  const [bags, setBags] = useState("1");
  const [cars, setCars] = useState<any[]>([]);
  const [loadingCars, setLoadingCars] = useState(true);

  useEffect(() => {
    getCars().then((data) => {
      setCars(Array.isArray(data) ? data : []);
      setLoadingCars(false);
    });
  }, []);

  const filteredCars = cars.filter(car => {
    return car.passengers >= parseInt(passengers || "1", 10) && car.bags >= parseInt(bags || "1", 10);
  });

  if (step === 2) {
    return (
      <Layout>
        <section className="relative mx-auto max-w-2xl px-6 py-40 text-center">
          {/* Decorative ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-96 h-96 rounded-full border border-gold/10 animate-ping" style={{ animationDuration: "3s" }} />
          </div>
          <div className="relative inline-flex h-28 w-28 items-center justify-center rounded-full border border-gold/30 bg-gold/5 shadow-[0_0_60px_rgba(var(--gold-rgb),0.15)]">
            <CheckCircle2 className="h-14 w-14 text-gold" strokeWidth={1.5} />
          </div>
          <h1 className="mt-10 text-5xl font-light tracking-tight">Reservation saved!</h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Your booking reference is <strong className="text-foreground">#{bookingId || "XYZ"}</strong>. To finalize your reservation, please complete your payment via Zelle.
          </p>
          
          <div className="mt-10 mx-auto max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm">
            <div className="bg-[#741acb] p-6 text-center">
              <div className="text-white font-black text-2xl tracking-widest uppercase">Zelle</div>
              <p className="text-white/80 text-xs mt-1">Send payment quickly and safely</p>
            </div>
            <div className="bg-card/50 p-8 text-center space-y-6">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Send your payment to:</div>
                <div className="text-xl font-bold text-foreground">{ZELLE_EMAIL}</div>
                <div className="text-xs text-muted-foreground mt-1">or phone: {ZELLE_PHONE}</div>
              </div>
              <div className="mx-auto w-32 h-32 rounded-xl bg-white p-3 shadow-lg">
                {/* Dummy auto-generated QR code based on email. Replace src with actual QR image URL from client if needed */}
                <img src={ZELLE_QR_IMAGE} alt="Zelle QR" className="w-full h-full object-contain" />
              </div>
              <div className="rounded-xl border border-gold/20 bg-gold/10 p-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-gold mb-1">Important: Zelle Memo</div>
                <div className="text-sm font-semibold text-foreground">Include <span className="text-gold">#{bookingId || "XYZ"}</span> in your Zelle Memo so we can identify your payment.</div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate({ to: "/" })}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gold px-10 py-4 text-sm font-bold uppercase tracking-[0.15em] text-black transition-all duration-500 hover:shadow-[0_8px_40px_rgba(var(--gold-rgb),0.4)] hover:-translate-y-0.5"
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative">Back to Home</span>
            </button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background text-foreground">
        {/* Ambient background decoration */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gold/[0.03] blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gold/[0.02] blur-3xl" />
        </div>

        {/* Step progress bar */}
        <div className="relative z-10 border-b border-white/5 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-6 py-5">
            <div className="flex items-center gap-4">
              <StepPill number={1} label="Select Vehicle" active={step === 0} done={step > 0} />
              <div className={`h-px flex-1 transition-all duration-700 ${step > 0 ? "bg-gold/50" : "bg-white/10"}`} />
              <StepPill number={2} label="Your Details" active={step === 1} done={step > 1} />
              <div className={`h-px flex-1 transition-all duration-700 ${step > 1 ? "bg-gold/50" : "bg-white/10"}`} />
              <StepPill number={3} label="Confirmed" active={step === 2} done={false} />
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[380px_1fr]">

          {/* ── Left Sidebar ── */}
          <aside className="sticky top-24 h-fit">
            <div className="overflow-hidden rounded-3xl border border-white/8 bg-card/60 shadow-[0_32px_64px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
              {/* Header */}
              <div className="relative border-b border-white/5 bg-gradient-to-br from-gold/10 to-transparent px-8 py-7">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full bg-gold/5" />
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold/70 mb-2">Your Journey</div>
                <h2 className="text-2xl font-light text-foreground">Ride Summary</h2>
              </div>

              {/* Summary items */}
              <div className="px-8 py-7 space-y-1">
                <SummaryItem icon={<Calendar className="h-3.5 w-3.5" />} label="Pickup Date" value={search.pickupDate || "Not set"} />
                <SummaryItem icon={<Clock className="h-3.5 w-3.5" />} label="Pickup Time" value={search.pickupTime || "Not set"} />
                <SummaryItem icon={<MapPin className="h-3.5 w-3.5" />} label="From" value={search.pickup || "Not set"} />
                <SummaryItem icon={<MapPin className="h-3.5 w-3.5" />} label="To" value={search.dropoff || "Not set"} />

                <div className="pt-2 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/4 border border-white/5 p-4">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-gold/50 mb-1.5">Distance</div>
                    <div className="text-sm font-semibold text-foreground">{search.distance || "—"}</div>
                  </div>
                  <div className="rounded-xl bg-white/4 border border-white/5 p-4">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-gold/50 mb-1.5">Duration</div>
                    <div className="text-sm font-semibold text-foreground">{search.duration || "—"}</div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="rounded-xl bg-white/4 border border-white/5 px-4 py-3">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-gold/50 mb-1.5">Service Type</div>
                    <div className="text-sm font-semibold text-foreground">{search.transferType || "One Way"}</div>
                  </div>
                </div>

                {search.transferType === "Return" && (
                  <div className="pt-2">
                    <div className="rounded-xl border border-gold/20 bg-gold/5 px-4 py-3">
                      <div className="text-[9px] font-bold uppercase tracking-widest text-gold/70 mb-1.5">Return</div>
                      <div className="text-sm font-semibold text-foreground">{search.returnDate} @ {search.returnTime}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Perks */}
              <div className="border-t border-white/5 px-8 py-6">
                <div className="space-y-3">
                  {[
                    { icon: Shield, text: "All taxes & tolls included" },
                    { icon: Zap, text: "Instant confirmation" },
                    { icon: Star, text: "Professional chauffeurs" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3 text-xs text-muted-foreground">
                      <Icon className="h-3.5 w-3.5 text-gold/60 shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Back button */}
              <div className="px-8 pb-8">
                <button
                  onClick={() => step === 0 ? navigate({ to: "/" }) : setStep(0)}
                  className="group flex w-full items-center justify-center gap-2.5 rounded-2xl border border-white/8 bg-white/3 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-all duration-300 hover:border-gold/30 hover:text-gold hover:bg-gold/5"
                >
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                  {step === 0 ? "Back to Home" : "Change Vehicle"}
                </button>
              </div>
            </div>
          </aside>

          {/* ── Right Main ── */}
          <main>
            {step === 0 ? (
              <div className="space-y-6">

                {/* Passenger / Bags selector */}
                <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-white/8 bg-card/50 px-8 py-6 backdrop-blur-sm">
                  <div className="flex flex-wrap gap-10">
                    <CountSelector icon={<Users className="h-4 w-4" />} label="Passengers" value={passengers} onChange={setPassengers} />
                    <CountSelector icon={<Briefcase className="h-4 w-4" />} label="Luggage" value={bags} onChange={setBags} />
                  </div>
                  <p className="text-xs text-muted-foreground italic">All prices include taxes & tolls.</p>
                </div>

                {/* Car cards */}
                <div className="grid gap-5">
                  {loadingCars ? (
                    <div className="flex flex-col gap-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-52 animate-pulse rounded-3xl bg-card/40 border border-white/5" />
                      ))}
                    </div>
                  ) : filteredCars.length === 0 ? (
                    <div className="rounded-3xl border border-white/5 bg-card/30 py-20 text-center text-muted-foreground">
                      No vehicles available matching your capacity requirements.
                    </div>
                  ) : (
                    filteredCars.map((car, idx) => {
                      let numericDistance = 0;
                      if (search.distance && typeof search.distance === "string") {
                        const match = search.distance.match(/([\d,\.]+)/);
                        if (match) numericDistance = parseFloat(match[1].replace(/,/g, ""));
                      } else if (typeof search.distance === "number") {
                        numericDistance = search.distance;
                      }

                      let estPrice = 0;
                      if (numericDistance > 0 && car.price_per_km) {
                        estPrice = Number(car.base_price || 0) + numericDistance * Number(car.price_per_km);
                      } else {
                        estPrice = Number(car.base_price || car.price_per_hour || 0);
                      }

                      return (
                        <CarCard
                          key={car.id}
                          car={car}
                          estPrice={estPrice}
                          numericDistance={numericDistance}
                          delay={idx * 0.08}
                          onSelect={() => { setSelectedCar({ ...car, price: estPrice }); setStep(1); }}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              /* ── Step 1: Details Form ── */
              <div className="overflow-hidden rounded-3xl border border-white/8 bg-card/50 shadow-[0_32px_64px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                {/* Form header */}
                <div className="relative border-b border-white/5 bg-gradient-to-r from-gold/8 to-transparent px-10 py-8">
                  <div className="flex items-center gap-6">
                    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black flex items-center justify-center shadow-xl">
                      <img src={selectedCar?.image_url} className="h-full w-full object-contain" alt={selectedCar?.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold/70 mb-1">Selected Vehicle</div>
                      <h2 className="text-2xl font-light text-foreground">{selectedCar?.name}</h2>
                      <div className="mt-2 text-xl font-bold text-gold">${Number(selectedCar?.price).toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {/* Form body */}
                <div className="px-10 py-10">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const bookingData = {
                        ...search,
                        selectedCar,
                        passengers,
                        bags,
                        firstName:    (formData.get("firstName")    as string) || "",
                        lastName:     (formData.get("lastName")     as string) || "",
                        email:        (formData.get("email")        as string) || "",
                        phone:        (formData.get("phone")        as string) || "",
                        flightNumber: (formData.get("flightNumber") as string) || null,
                        comments:     (formData.get("comments")     as string) || null,
                      };
                      if (!bookingData.firstName || !bookingData.lastName || !bookingData.email || !bookingData.phone) {
                        alert("Please fill in all required fields.");
                        return;
                      }
                      const res = await createBooking({ data: bookingData });
                      if (res.success) {
                        setBookingId(res.bookingId);
                        setStep(2);
                      }
                      else alert("Failed to book: " + res.error);
                    }}
                    className="space-y-8"
                  >
                    <div>
                      <SectionLabel>Personal Information</SectionLabel>
                      <div className="mt-4 grid gap-5 md:grid-cols-2">
                        <BookField name="firstName" label="First Name" required placeholder="John" />
                        <BookField name="lastName" label="Last Name" required placeholder="Doe" />
                      </div>
                    </div>

                    <div>
                      <SectionLabel>Contact Details</SectionLabel>
                      <div className="mt-4 grid gap-5 md:grid-cols-2">
                        <BookField name="email" label="Email Address" type="email" required placeholder="john@example.com" />
                        <BookField name="phone" label="Phone Number" type="tel" required placeholder="+1 (555) 000-0000" />
                      </div>
                    </div>

                    <div>
                      <SectionLabel>Additional Info</SectionLabel>
                      <div className="mt-4 space-y-5">
                        <BookField name="flightNumber" label="Flight Number (Optional)" placeholder="e.g. EK202" />
                        <div>
                          <label className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Comments / Special Requests
                          </label>
                          <textarea
                            name="comments"
                            rows={4}
                            placeholder="Child seat, chilled water, specific route, etc."
                            className="w-full rounded-2xl border border-white/8 bg-white/4 px-6 py-4 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all duration-300 focus:border-gold/40 focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(var(--gold-rgb),0.06)] resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="group relative w-full overflow-hidden rounded-2xl bg-gold py-5 text-sm font-black uppercase tracking-[0.2em] text-black transition-all duration-500 hover:shadow-[0_12px_40px_rgba(var(--gold-rgb),0.45)] hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-400" />
                      <span className="relative flex items-center justify-center gap-3">
                        Confirm Reservation
                        <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}

/* ──────────────────────────────────────────
   Sub-components
────────────────────────────────────────── */

function StepPill({ number, label, active, done }: { number: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-500 ${
        done ? "bg-gold text-black" : active ? "border-2 border-gold text-gold" : "border border-white/15 text-muted-foreground"
      }`}>
        {done ? "✓" : number}
      </div>
      <span className={`hidden text-xs font-semibold uppercase tracking-widest sm:block transition-colors duration-300 ${active ? "text-foreground" : "text-muted-foreground"}`}>
        {label}
      </span>
    </div>
  );
}

function SummaryItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <div className="mt-0.5 shrink-0 text-gold/50">{icon}</div>
      <div className="min-w-0">
        <div className="text-[9px] font-bold uppercase tracking-widest text-gold/50 mb-0.5">{label}</div>
        <div className="text-sm font-medium text-foreground truncate">{value}</div>
      </div>
    </div>
  );
}

function CountSelector({ icon, label, value, onChange }: { icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/20 bg-gold/8 text-gold">
        {icon}
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-base font-bold text-foreground outline-none cursor-pointer"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <option key={n} value={n} className="bg-card text-foreground">{n}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function CarCard({ car, estPrice, numericDistance, delay, onSelect }: {
  car: any; estPrice: number; numericDistance: number; delay: number; onSelect: () => void;
}) {
  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/6 bg-card/40 transition-all duration-500 hover:border-gold/25 hover:bg-card/70 hover:shadow-[0_24px_60px_rgba(0,0,0,0.5)] md:flex-row"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Image */}
      <div className="relative h-60 w-full shrink-0 overflow-hidden bg-zinc-950 flex items-center justify-center md:h-auto md:w-72">
        <img
          src={car.image_url}
          alt={car.name}
          className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60 hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent md:hidden" />
        {/* Category badge */}
        <div className="absolute top-4 left-4 rounded-full border border-gold/30 bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold backdrop-blur-sm">
          Premium
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-8 md:flex-row md:items-center">
        <div>
          <h3 className="text-2xl font-light tracking-tight text-foreground md:text-3xl">{car.name}</h3>
          <div className="mt-4 flex gap-5">
            <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-3 py-1.5 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5 text-gold" />
              {car.passengers} passengers
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-3 py-1.5 text-xs text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5 text-gold" />
              {car.bags} bags
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-8 md:mt-0 md:flex-col md:items-end">
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
              {numericDistance > 0 ? "Estimated Total" : "Est. / Hour"}
            </div>
            <div className="text-4xl font-black tracking-tight text-foreground">
              ${Number(estPrice).toFixed(2)}
            </div>
          </div>
          <button
            onClick={onSelect}
            className="group/btn relative overflow-hidden rounded-full bg-gold px-8 py-3.5 text-sm font-black uppercase tracking-widest text-black transition-all duration-400 hover:shadow-[0_8px_32px_rgba(var(--gold-rgb),0.5)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
            <span className="relative">Reserve</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-white/6" />
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold/60">{children}</span>
      <div className="h-px flex-1 bg-white/6" />
    </div>
  );
}

function BookField({ name, label, type = "text", placeholder, required }: {
  name: string; label: string; type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-2xl border border-white/8 bg-white/4 px-6 py-4 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all duration-300 focus:border-gold/40 focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(var(--gold-rgb),0.06)]"
      />
    </div>
  );
}