import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import React, { useState, useEffect, useMemo } from "react";
import {
  Shield, LayoutDashboard, Users, Calendar, LogOut, Plus, Trash2,
  ChevronLeft, ChevronRight, Search, TrendingUp, Car, Clock,
  Upload, Link, X, CheckCircle, AlertCircle, Eye, RefreshCw,
} from "lucide-react";
import { getBookings, updateBookingStatus } from "@/lib/bookings.server";
import { getCars, addCar, deleteCar } from "@/lib/cars.server";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Panel — Simba Luxury" }],
  }),
  component: AdminPage,
});

const BOOKINGS_PER_PAGE = 8;
const CARS_PER_PAGE = 6;

function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dbError, setDbError] = useState(false);

  // Pagination
  const [bookingPage, setBookingPage] = useState(1);
  const [carsPage, setCarsPage] = useState(1);

  // Search / filter
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatus, setBookingStatus] = useState("All");
  const [activeTab, setActiveTab] = useState<"fleet" | "bookings">("bookings");

  // Expand booking detail
  const [expandedBooking, setExpandedBooking] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setDbError(false);
    try {
      const [b, c] = await Promise.all([getBookings(), getCars()]);
      setBookings(Array.isArray(b) ? b : []);
      setCars(Array.isArray(c) ? c : []);
      if (!Array.isArray(b) || !Array.isArray(c)) setDbError(true);
    } catch (err) {
      console.error("[Admin] fetchData failed:", err);
      setDbError(true);
      setBookings([]);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@gmail.com" && password === "admin123@") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials!");
    }
  };

  const handleAddCar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get("imageFile") as File;
    let imageUrl = formData.get("imageUrl") as string;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });
    }
    const data = {
      name: formData.get("name"),
      imageUrl,
      passengers: parseInt(formData.get("passengers") as string),
      bags: parseInt(formData.get("bags") as string),
      pricePerKm: parseFloat(formData.get("pricePerKm") as string),
      pricePerHour: parseFloat(formData.get("pricePerHour") as string),
      basePrice: parseFloat((formData.get("basePrice") as string) || "0"),
    };
    
    // Save form reference before awaiting
    const form = e.currentTarget as HTMLFormElement;

    // @ts-ignore
    const res = await addCar({ data });
    if (res.success) { form.reset(); fetchData(); }
    else alert("Failed to add car: " + (res.error || "DB error"));
  };

  // ── Derived / filtered data ──
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        bookingSearch === "" ||
        `${b.first_name} ${b.last_name} ${b.email} ${b.vehicle_name} ${b.pickup_location}`
          .toLowerCase()
          .includes(bookingSearch.toLowerCase());
      const matchStatus = bookingStatus === "All" || b.status === bookingStatus;
      return matchSearch && matchStatus;
    });
  }, [bookings, bookingSearch, bookingStatus]);

  const totalBookingPages = Math.max(1, Math.ceil(filteredBookings.length / BOOKINGS_PER_PAGE));
  const pagedBookings = filteredBookings.slice(
    (bookingPage - 1) * BOOKINGS_PER_PAGE,
    bookingPage * BOOKINGS_PER_PAGE
  );

  const totalCarPages = Math.max(1, Math.ceil(cars.length / CARS_PER_PAGE));
  const pagedCars = cars.slice((carsPage - 1) * CARS_PER_PAGE, carsPage * CARS_PER_PAGE);

  const totalVolume = bookings.reduce((acc, b) => acc + parseFloat(b.price || 0), 0);
  const pendingCount = bookings.filter((b) => b.status === "Pending").length;

  // ── LOGIN SCREEN ──
  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="relative flex min-h-[100vh] items-center justify-center bg-background px-6 overflow-hidden">
          {/* Ambient */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-gold/3 blur-3xl" />
          </div>

          <div className="relative w-full max-w-md">
            {/* Card */}
            <div className="overflow-hidden rounded-3xl border border-white/8 bg-card/60 shadow-[0_40px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
              {/* Top accent */}
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-gold to-transparent" />

              <div className="px-10 py-12">
                <div className="mb-10 text-center">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl border border-gold/20 bg-gold/8 shadow-[0_0_40px_rgba(var(--gold-rgb),0.15)]">
                    <Shield className="h-10 w-10 text-gold" strokeWidth={1.5} />
                  </div>
                  <h1 className="mt-6 text-3xl font-light tracking-tight text-foreground">Admin Access</h1>
                  <p className="mt-2 text-sm text-muted-foreground">Simba Luxury Control Panel</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <LoginField label="Email Address" type="email" value={email} onChange={setEmail} placeholder="admin@gmail.com" />
                  <LoginField label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
                  <button
                    type="submit"
                    className="group relative mt-2 w-full overflow-hidden rounded-2xl bg-gold py-4 text-sm font-black uppercase tracking-[0.2em] text-black transition-all duration-400 hover:shadow-[0_12px_40px_rgba(var(--gold-rgb),0.45)] hover:-translate-y-0.5"
                  >
                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative">Enter Dashboard</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ── DASHBOARD ──
  return (
    <Layout>
      <div className="min-h-screen bg-background text-foreground">

        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/6 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-8xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-gold/30 bg-gold/10">
                <Shield className="h-5 w-5 text-gold" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold/60">Control Panel</div>
                <div className="text-base font-semibold leading-none text-foreground">Simba Admin</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchData}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-4 py-2 text-xs font-semibold text-muted-foreground transition-all hover:border-gold/30 hover:text-gold disabled:opacity-40"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-4 py-2 text-xs font-semibold text-muted-foreground transition-all hover:border-red-500/40 hover:bg-red-500/8 hover:text-red-400"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-8xl px-6 py-10 space-y-8">

          {/* DB Error banner */}
          {dbError && (
            <div className="flex items-center gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/6 px-6 py-4 text-sm text-amber-400">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div><strong>Database Offline:</strong> Could not connect to MySQL. Check your <code>.env</code> and ensure MySQL is running.</div>
            </div>
          )}

          {/* Stat Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={TrendingUp} label="Total Volume" value={`$${totalVolume.toFixed(2)}`} sub={`${bookings.length} rides`} color="gold" />
            <StatCard icon={Car} label="Active Fleet" value={cars.length.toString()} sub="vehicles registered" color="blue" />
            <StatCard icon={Clock} label="Pending" value={pendingCount.toString()} sub="awaiting dispatch" color="amber" />
            <StatCard icon={CheckCircle} label="Confirmed" value={bookings.filter(b => b.status === "Confirmed").length.toString()} sub="completed rides" color="green" />
          </div>

          {/* Tab nav */}
          <div className="flex gap-1 rounded-2xl border border-white/6 bg-white/3 p-1.5 w-fit">
            {(["bookings", "fleet"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-gold text-black shadow-[0_4px_16px_rgba(var(--gold-rgb),0.35)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "bookings" ? "Reservations" : "Fleet"}
              </button>
            ))}
          </div>

          {/* ── BOOKINGS TAB ── */}
          {activeTab === "bookings" && (
            <div className="overflow-hidden rounded-3xl border border-white/6 bg-card/40 backdrop-blur-sm">
              {/* Table header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/6 bg-white/3 px-8 py-6">
                <div>
                  <h2 className="text-lg font-light text-foreground">Reservations</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{filteredBookings.length} results</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      value={bookingSearch}
                      onChange={(e) => { setBookingSearch(e.target.value); setBookingPage(1); }}
                      placeholder="Search client, vehicle…"
                      className="rounded-xl border border-white/8 bg-white/5 pl-9 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-gold/40 w-52 transition-all"
                    />
                    {bookingSearch && (
                      <button onClick={() => setBookingSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  {/* Status filter */}
                  <select
                    value={bookingStatus}
                    onChange={(e) => { setBookingStatus(e.target.value); setBookingPage(1); }}
                    className="rounded-xl border border-white/8 bg-white/5 px-4 py-2.5 text-xs text-foreground outline-none focus:border-gold/40 cursor-pointer transition-all"
                  >
                    {["All", "Pending", "Confirmed"].map(s => <option key={s} value={s} className="bg-card">{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {["Client", "Itinerary", "Vehicle", "Date", "Status", ""].map(h => (
                        <th key={h} className="px-7 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/4">
                    {pagedBookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-8 py-20 text-center text-sm text-muted-foreground italic">No reservations found.</td>
                      </tr>
                    ) : pagedBookings.map((booking) => (
                      <React.Fragment key={booking.id}>
                        <tr
                          className="group transition-all duration-200 hover:bg-white/4 cursor-pointer"
                          onClick={() => setExpandedBooking(expandedBooking === booking.id ? null : booking.id)}
                        >
                          <td className="px-7 py-5">
                            <div className="font-semibold text-foreground">{booking.first_name} {booking.last_name}</div>
                            <div className="text-[11px] text-muted-foreground mt-0.5">{booking.email}</div>
                          </td>
                          <td className="px-7 py-5">
                            <div className="text-sm text-foreground max-w-[180px] truncate">{booking.pickup_location}</div>
                            <div className="text-[11px] text-gold font-semibold mt-0.5 max-w-[180px] truncate">→ {booking.dropoff_location}</div>
                          </td>
                          <td className="px-7 py-5">
                            <span className="rounded-lg border border-gold/20 bg-gold/8 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold">
                              {booking.vehicle_name}
                            </span>
                          </td>
                          <td className="px-7 py-5 text-sm text-muted-foreground whitespace-nowrap">
                            {new Date(booking.pickup_date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                          </td>
                          <td className="px-7 py-5">
                            <StatusBadge status={booking.status} />
                          </td>
                          <td className="px-7 py-5 text-right">
                            <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-white/4 text-muted-foreground transition-all group-hover:border-gold/30 group-hover:text-gold ${expandedBooking === booking.id ? "rotate-180 border-gold/30 text-gold" : ""}`}>
                              <ChevronRight className="h-4 w-4 rotate-90" />
                            </div>
                          </td>
                        </tr>
                        {/* Expanded detail row */}
                        {expandedBooking === booking.id && (
                          <tr key={`detail-${booking.id}`} className="bg-gold/3 border-b border-gold/10">
                            <td colSpan={6} className="px-8 py-6">
                              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <DetailCell label="Phone" value={booking.phone || "—"} />
                                <DetailCell label="ID Number" value={booking.id_number || "—"} />
                                <DetailCell label="Flight #" value={booking.flight_number || "—"} />
                                <DetailCell label="Passengers" value={booking.passengers || "—"} />
                                <DetailCell label="Bags" value={booking.bags || "—"} />
                                <DetailCell label="Service" value={booking.transfer_type || "One Way"} />
                                <DetailCell label="Distance" value={booking.distance || "—"} />
                                <DetailCell label="Price" value={booking.price ? `$${parseFloat(booking.price).toFixed(2)}` : "—"} highlight />
                                {booking.comments && <DetailCell label="Notes" value={booking.comments} />}
                                
                                <div className="col-span-full mt-4 flex items-center justify-end gap-4 border-t border-white/5 pt-4">
                                  {booking.status === "Pending" ? (
                                    <button 
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        if (confirm("Mark this booking as Paid & Confirmed?")) {
                                          const res = await updateBookingStatus({ data: { id: booking.id, status: "Confirmed" } });
                                          if (res.success) fetchData();
                                          else alert("Failed to confirm: " + res.error);
                                        }
                                      }}
                                      className="flex items-center gap-2 rounded-xl bg-gold px-6 py-2.5 text-xs font-black uppercase tracking-widest text-black transition-all hover:bg-gold/90 hover:shadow-[0_0_20px_rgba(var(--gold-rgb),0.4)]"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                      Mark Paid & Confirm
                                    </button>
                                  ) : (
                                    <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-emerald-400">
                                      <CheckCircle className="h-4 w-4" /> Payment Verified
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <Pagination
                current={bookingPage}
                total={totalBookingPages}
                onChange={(p) => { setBookingPage(p); setExpandedBooking(null); }}
                itemCount={filteredBookings.length}
                perPage={BOOKINGS_PER_PAGE}
              />
            </div>
          )}

          {/* ── FLEET TAB ── */}
          {activeTab === "fleet" && (
            <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
              {/* Cars table */}
              <div className="overflow-hidden rounded-3xl border border-white/6 bg-card/40 backdrop-blur-sm">
                <div className="flex items-center justify-between border-b border-white/6 bg-white/3 px-8 py-6">
                  <div>
                    <h2 className="text-lg font-light text-foreground">Fleet</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">{cars.length} vehicles registered</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/5">
                        {["Vehicle", "Capacity", "$/KM", "$/HR", "Base", ""].map(h => (
                          <th key={h} className="px-7 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/4">
                      {pagedCars.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-8 py-20 text-center text-sm text-muted-foreground italic">No vehicles in fleet.</td>
                        </tr>
                      ) : pagedCars.map((car) => (
                        <tr key={car.id} className="group transition-all duration-200 hover:bg-white/4">
                          <td className="px-7 py-5">
                            <div className="flex items-center gap-3">
                              {car.image_url && (
                                <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-white/8 bg-zinc-900 flex items-center justify-center">
                                  <img src={car.image_url} alt={car.name} className="h-full w-full object-contain" />
                                </div>
                              )}
                              <span className="font-semibold text-foreground">{car.name}</span>
                            </div>
                          </td>
                          <td className="px-7 py-5 text-muted-foreground text-sm">{car.passengers}P / {car.bags}B</td>
                          <td className="px-7 py-5 font-bold text-gold">${car.price_per_km}</td>
                          <td className="px-7 py-5 font-bold text-gold">${car.price_per_hour}</td>
                          <td className="px-7 py-5 text-muted-foreground">${car.base_price}</td>
                          <td className="px-7 py-5 text-right">
                            <button
                              onClick={async () => {
                                if (confirm("Remove this vehicle from fleet?")) {
                                  // @ts-ignore
                                  const res = await deleteCar({ data: car.id });
                                  if (res.success) fetchData();
                                }
                              }}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-white/4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:border-red-500/40 hover:bg-red-500/8 hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  current={carsPage}
                  total={totalCarPages}
                  onChange={setCarsPage}
                  itemCount={cars.length}
                  perPage={CARS_PER_PAGE}
                />
              </div>

              {/* Add Car Form */}
              <div className="overflow-hidden rounded-3xl border border-white/6 bg-card/40 backdrop-blur-sm h-fit">
                <div className="border-b border-white/6 bg-white/3 px-8 py-6">
                  <h3 className="text-lg font-light text-foreground">Add Vehicle</h3>
                </div>
                <div className="px-8 py-8">
                  <form onSubmit={handleAddCar} className="space-y-5">
                    <FormField name="name" label="Name & Model" placeholder="e.g. Rolls Royce Ghost" required />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField name="passengers" label="Passengers" type="number" placeholder="4" required />
                      <FormField name="bags" label="Bags" type="number" placeholder="4" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField name="pricePerKm" label="Price / KM" type="number" step="0.01" placeholder="5.00" required />
                      <FormField name="pricePerHour" label="Price / Hour" type="number" step="0.01" placeholder="90.00" required />
                    </div>
                    <FormField name="basePrice" label="Base Price" type="number" step="0.01" placeholder="100.00" required />

                    <div className="rounded-2xl border border-dashed border-white/15 bg-white/3 p-5 space-y-4">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-gold/60">Vehicle Image</div>
                      <FormField name="imageUrl" label="Image URL" placeholder="https://unsplash.com/..." />
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="h-px flex-1 bg-white/8" /> or upload <div className="h-px flex-1 bg-white/8" />
                      </div>
                      <div>
                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Upload from PC</label>
                        <input
                          name="imageFile"
                          type="file"
                          accept="image/*"
                          className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-xs text-foreground outline-none file:mr-3 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-1.5 file:text-[10px] file:font-black file:uppercase file:tracking-wider file:text-black hover:file:bg-gold/80 transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="group relative w-full overflow-hidden rounded-2xl bg-gold py-4 text-xs font-black uppercase tracking-[0.2em] text-black transition-all duration-400 hover:shadow-[0_8px_30px_rgba(var(--gold-rgb),0.4)] hover:-translate-y-0.5"
                    >
                      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <span className="relative">Register Vehicle</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}

/* ─────────────────────────────────────────
   Sub-components
───────────────────────────────────────── */

function LoginField({ label, type, value, onChange, placeholder }: {
  label: string; type: string; value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full rounded-2xl border border-white/8 bg-white/5 px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all focus:border-gold/40 focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(var(--gold-rgb),0.06)]"
      />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: string; sub: string; color: "gold" | "blue" | "amber" | "green";
}) {
  const colorMap = {
    gold: "border-gold/20 bg-gold/8 text-gold",
    blue: "border-blue-500/20 bg-blue-500/8 text-blue-400",
    amber: "border-amber-500/20 bg-amber-500/8 text-amber-400",
    green: "border-emerald-500/20 bg-emerald-500/8 text-emerald-400",
  };
  return (
    <div className="group rounded-2xl border border-white/6 bg-card/40 p-6 transition-all duration-300 hover:border-white/12 hover:-translate-y-0.5 backdrop-blur-sm">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${colorMap[color]}`}>
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </div>
      <div className="mt-4 text-2xl font-bold text-foreground tracking-tight">{value}</div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-xs text-muted-foreground/60">{sub}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Confirmed: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
    Pending: "border-gold/25 bg-gold/10 text-gold",
  };
  return (
    <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${styles[status] ?? "border-white/10 bg-white/5 text-muted-foreground"}`}>
      {status}
    </span>
  );
}

function DetailCell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-white/6 bg-white/3 px-4 py-3">
      <div className="text-[9px] font-bold uppercase tracking-widest text-gold/50 mb-1">{label}</div>
      <div className={`text-sm font-semibold ${highlight ? "text-gold" : "text-foreground"}`}>{value}</div>
    </div>
  );
}

function FormField({ name, label, type = "text", placeholder, required, step }: {
  name: string; label: string; type?: string; placeholder?: string; required?: boolean; step?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        step={step}
        className="w-full rounded-xl border border-white/8 bg-white/4 px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all focus:border-gold/40 focus:bg-white/6 focus:shadow-[0_0_0_3px_rgba(var(--gold-rgb),0.05)]"
      />
    </div>
  );
}

function Pagination({ current, total, onChange, itemCount, perPage }: {
  current: number; total: number; onChange: (p: number) => void; itemCount: number; perPage: number;
}) {
  if (total <= 1) return null;
  const start = (current - 1) * perPage + 1;
  const end = Math.min(current * perPage, itemCount);

  const pages = Array.from({ length: total }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === total || Math.abs(p - current) <= 1
  );

  const rendered: (number | "...")[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) rendered.push("...");
    rendered.push(p);
  });

  return (
    <div className="flex items-center justify-between border-t border-white/5 px-7 py-5">
      <div className="text-xs text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{start}–{end}</span> of <span className="font-semibold text-foreground">{itemCount}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <PaginationBtn onClick={() => onChange(current - 1)} disabled={current === 1}>
          <ChevronLeft className="h-3.5 w-3.5" />
        </PaginationBtn>
        {rendered.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-xs text-muted-foreground">…</span>
          ) : (
            <PaginationBtn key={p} onClick={() => onChange(p as number)} active={p === current}>
              {p}
            </PaginationBtn>
          )
        )}
        <PaginationBtn onClick={() => onChange(current + 1)} disabled={current === total}>
          <ChevronRight className="h-3.5 w-3.5" />
        </PaginationBtn>
      </div>
    </div>
  );
}

function PaginationBtn({ children, onClick, disabled, active }: {
  children: React.ReactNode; onClick: () => void; disabled?: boolean; active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold transition-all duration-200 ${
        active
          ? "bg-gold text-black shadow-[0_4px_12px_rgba(var(--gold-rgb),0.35)]"
          : disabled
          ? "text-muted-foreground/30 cursor-not-allowed"
          : "border border-white/8 bg-white/4 text-muted-foreground hover:border-gold/30 hover:text-gold"
      }`}
    >
      {children}
    </button>
  );
}