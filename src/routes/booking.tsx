import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Layout } from "@/components/site/Layout";
import { useState } from "react";
import { Calendar, MapPin, Clock, Car, CheckCircle2, ArrowLeft, Users, Briefcase, ChevronRight } from "lucide-react";
import { query } from "@/lib/db";

const createBooking = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    try {
      await query(
        `INSERT INTO bookings (
          pickup_date, pickup_time, pickup_location, dropoff_location, 
          transfer_type, return_date, return_time, extra_waiting, 
          distance, duration, passengers, bags, vehicle_name, 
          price, first_name, last_name, email, phone, flight_number, comments
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.pickupDate, data.pickupTime, data.pickup, data.dropoff,
          data.transferType, data.returnDate || null, data.returnTime || null, data.extraWaiting,
          data.distance, data.duration, data.passengers, data.bags, data.selectedCar.name,
          data.selectedCar.price, data.firstName, data.lastName, data.email, data.phone,
          data.flightNumber, data.comments
        ]
      );
      return { success: true };
    } catch (error) {
      console.error("Booking failed:", error);
      return { success: false, error: "Failed to save booking" };
    }
  });

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

const cars = [
  {
    id: "business-suv",
    name: "Business suv",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
    passengers: 6,
    bags: 6,
    price: 245.71
  },
  {
    id: "luxury-suv",
    name: "Luxury SUV",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
    passengers: 6,
    bags: 6,
    price: 297.37
  }
];

function BookingPage() {
  const search: any = useSearch({ from: "/booking" });
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: Cars, 1: Details, 2: Success
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [passengers, setPassengers] = useState("1");
  const [bags, setBags] = useState("1");

  if (step === 2) {
    return (
      <Layout>
        <section className="mx-auto max-w-2xl px-6 py-32 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-gold" />
          <h1 className="mt-6 text-4xl">Reservation received.</h1>
          <p className="mt-4 text-muted-foreground">
            Thank you. A dispatcher will confirm your ride and send a receipt within 15 minutes.
          </p>
          <button onClick={() => navigate({ to: "/" })} className="mt-8 rounded-md border border-gold px-6 py-3 font-semibold text-gold hover:bg-gold hover:text-gold-foreground">
            Back to Home
          </button>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-16 text-foreground">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[350px_1fr]">
          
          {/* Left Sidebar: Summary */}
          <aside className="animate-luxury glass sticky top-24 h-fit rounded-2xl p-8 shadow-luxury">
            <h2 className="text-gradient-gold mb-8 text-3xl font-bold uppercase tracking-tight">Your Ride</h2>
            <div className="space-y-6">
              <SummaryItem label="Pickup Date" value={search.pickupDate || "Not set"} />
              <SummaryItem label="Pickup Time" value={search.pickupTime || "Not set"} />
              <SummaryItem label="Pickup Location" value={search.pickup || "Not set"} />
              <SummaryItem label="Drop-Off Location" value={search.dropoff || "Not set"} />
              <div className="grid grid-cols-2 gap-4">
                <SummaryItem label="Distance" value={search.distance || "—"} />
                <SummaryItem label="Duration" value={search.duration || "—"} />
              </div>
              <SummaryItem label="Service Type" value={search.transferType || "One Way"} />
              {search.transferType === "Return" && (
                <div className="rounded-lg bg-white/5 p-4">
                  <SummaryItem label="Return" value={`${search.returnDate} @ ${search.returnTime}`} />
                </div>
              )}
            </div>

            <button 
              onClick={() => step === 0 ? navigate({ to: "/" }) : setStep(0)}
              className="mt-10 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-4 text-sm font-semibold text-muted-foreground transition-luxury hover:border-gold/50 hover:text-gold"
            >
              <ArrowLeft className="h-4 w-4" /> Go Back
            </button>
          </aside>

          {/* Right Main Content */}
          <main className="animate-luxury" style={{ animationDelay: "0.2s" }}>
            {step === 0 ? (
              <div className="space-y-8">
                {/* Passenger/Bag Selection */}
                <div className="glass flex flex-wrap items-center justify-between gap-6 rounded-2xl p-8 shadow-luxury">
                  <div className="flex flex-wrap gap-8">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Passengers</div>
                        <select value={passengers} onChange={(e) => setPassengers(e.target.value)} className="bg-transparent text-lg font-bold outline-none">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} className="bg-card">{n}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Luggage</div>
                        <select value={bags} onChange={(e) => setBags(e.target.value)} className="bg-transparent text-lg font-bold outline-none">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} className="bg-card">{n}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground italic">Pricing inclusive of all taxes and tolls.</div>
                </div>

                {/* Car List */}
                <div className="grid gap-6">
                  {cars.map((car) => (
                    <div key={car.id} className="transition-luxury group flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-card/40 shadow-luxury hover:border-gold/30 hover:bg-card md:flex-row">
                      <div className="relative h-64 w-full overflow-hidden md:h-auto md:w-80">
                        <img src={car.image} alt={car.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent md:hidden" />
                      </div>
                      <div className="flex flex-1 flex-col p-8 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Premium Fleet</div>
                          <h3 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{car.name}</h3>
                          <div className="mt-6 flex gap-6">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="h-4 w-4 text-gold" /> {car.passengers} Max</div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Briefcase className="h-4 w-4 text-gold" /> {car.bags} Max</div>
                          </div>
                        </div>
                        <div className="mt-8 flex items-center justify-between gap-10 md:mt-0 md:flex-col md:items-end md:justify-center md:gap-4">
                          <div className="text-right">
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Est. Total</div>
                            <div className="text-4xl font-black text-foreground">${car.price.toFixed(2)}</div>
                          </div>
                          <button 
                            onClick={() => { setSelectedCar(car); setStep(1); }}
                            className="bg-gradient-gold rounded-full px-10 py-4 font-bold text-gold-foreground transition-luxury hover:scale-105 hover:shadow-gold"
                          >
                            Reserve Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Step 1: Client Details Form */
              <div className="glass rounded-3xl p-10 shadow-luxury">
                <div className="mb-10 flex items-center gap-6">
                  <div className="h-16 w-24 overflow-hidden rounded-xl border border-white/10 shadow-lg">
                    <img src={selectedCar?.image} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-gradient-gold text-3xl font-bold">Secure Your Reservation</h2>
                    <p className="text-muted-foreground">Confirming details for your {selectedCar?.name}</p>
                  </div>
                </div>
                
                <form 
                  onSubmit={async (e) => { 
                    e.preventDefault(); 
                    const formData = new FormData(e.currentTarget);
                    const bookingData = {
                      ...search,
                      selectedCar,
                      passengers,
                      bags,
                      firstName: formData.get("firstName"),
                      lastName: formData.get("lastName"),
                      email: formData.get("email"),
                      phone: formData.get("phone"),
                      flightNumber: formData.get("flightNumber"),
                      comments: formData.get("comments")
                    };
                    const res = await createBooking({ data: bookingData });
                    if (res.success) setStep(2);
                    else alert("Failed to book: " + res.error);
                  }}
                  className="grid gap-8 md:grid-cols-2"
                >
                  <BookField name="firstName" label="First Name" required placeholder="John" />
                  <BookField name="lastName" label="Last Name" required placeholder="Doe" />
                  <BookField name="email" label="Email Address" type="email" required placeholder="john@example.com" />
                  <BookField name="phone" label="Phone Number" type="tel" required placeholder="+1 (555) 000-0000" />
                  <div className="md:col-span-2">
                    <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Flight Number (Optional)</label>
                    <input name="flightNumber" className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-foreground outline-none transition-luxury focus:border-gold/50 focus:bg-white/10" placeholder="e.g. EK202" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Comments / Special Requests</label>
                    <textarea name="comments" rows={4} className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-foreground outline-none transition-luxury focus:border-gold/50 focus:bg-white/10" placeholder="Child seat, chilled water, specific route, etc." />
                  </div>
                  <button type="submit" className="bg-gradient-gold md:col-span-2 mt-4 flex items-center justify-center gap-3 rounded-xl py-5 text-lg font-black uppercase tracking-widest text-gold-foreground shadow-gold transition-luxury hover:scale-[1.02]">
                    Confirm Reservation <ChevronRight className="h-6 w-6" />
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/5 pb-3 last:border-0">
      <div className="text-[10px] font-bold uppercase tracking-widest text-gold/60">{label}</div>
      <div className="mt-1 font-medium text-foreground">{value}</div>
    </div>
  );
}

function BookField({ name, label, type = "text", placeholder, required }: { name: string; label: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
      <input name={name} type={type} placeholder={placeholder} required={required} className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-foreground outline-none transition-luxury focus:border-gold/50 focus:bg-white/10" />
    </div>
  );
}
