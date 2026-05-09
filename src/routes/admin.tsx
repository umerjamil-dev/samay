import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Layout } from "@/components/site/Layout";
import { useState, useEffect } from "react";
import { Shield, LayoutDashboard, Users, Calendar, LogOut, Plus, Trash2 } from "lucide-react";
import { query } from "@/lib/db";

const getBookings = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      return await query("SELECT * FROM bookings ORDER BY created_at DESC");
    } catch (err) {
      console.error("[Admin] getBookings DB error:", err);
      return [];
    }
  });

const getCars = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      return await query("SELECT * FROM cars ORDER BY created_at DESC");
    } catch (err) {
      console.error("[Admin] getCars DB error:", err);
      return [];
    }
  });

const addCar = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    try {
      await query(
        "INSERT INTO cars (name, passengers, bags, price_per_km, base_price) VALUES (?, ?, ?, ?, ?)",
        [data.name, data.passengers, data.bags, data.pricePerKm, data.basePrice]
      );
      return { success: true };
    } catch (err: any) {
      console.error("[Admin] addCar DB error:", err);
      return { success: false, error: err.message };
    }
  });

const deleteCar = createServerFn({ method: "POST" })
  .handler(async ({ data: id }: { data: number }) => {
    try {
      await query("DELETE FROM cars WHERE id = ?", [id]);
      return { success: true };
    } catch (err: any) {
      console.error("[Admin] deleteCar DB error:", err);
      return { success: false, error: err.message };
    }
  });

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — Simba Luxury" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dbError, setDbError] = useState(false);

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
    if (isLoggedIn) {
      fetchData();
    }
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
    const data = {
      name: formData.get("name"),
      passengers: parseInt(formData.get("passengers") as string),
      bags: parseInt(formData.get("bags") as string),
      pricePerKm: parseFloat(formData.get("pricePerKm") as string),
      basePrice: parseFloat(formData.get("basePrice") as string || "0"),
    };
    const res = await addCar({ data });
    if (res.success) {
      e.currentTarget.reset();
      fetchData();
    } else {
      alert("Failed to add car: " + (res.error || "DB error"));
    }
  };

  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="flex min-h-[80vh] items-center justify-center bg-background px-6">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-luxury">
            <div className="mb-8 text-center">
              <Shield className="mx-auto h-12 w-12 text-gold" />
              <h1 className="mt-4 text-3xl font-bold text-foreground">Admin Login</h1>
              <p className="text-muted-foreground">Enter your credentials to manage bookings.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-border bg-secondary px-4 py-3 outline-none focus:border-gold text-foreground" 
                  placeholder="admin@gmail.com" 
                  required 
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-border bg-secondary px-4 py-3 outline-none focus:border-gold text-foreground" 
                  placeholder="••••••••" 
                  required 
                />
              </div>
              <button type="submit" className="w-full rounded-md bg-gradient-gold py-4 font-bold text-gold-foreground shadow-gold transition hover:scale-[1.02]">
                Login to Dashboard
              </button>
            </form>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background text-foreground">
        <header className="glass sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-gold shadow-gold">
                <Shield className="h-6 w-6 text-gold-foreground" />
              </div>
              <span className="text-2xl font-black uppercase tracking-tighter text-white">Simba Admin</span>
            </div>
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-luxury hover:bg-destructive hover:text-white"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-16">
          {dbError && (
            <div className="mb-8 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 px-8 py-5 text-sm text-yellow-400">
              ⚠️ <strong>Database Offline:</strong> Could not connect to MySQL. Check your <code>.env</code> credentials and ensure MySQL is running.
            </div>
          )}
          {loading && (
            <div className="mb-8 text-center text-sm text-muted-foreground animate-pulse">Loading data from database...</div>
          )}
          <div className="grid gap-16">
            {/* Stats */}
            <div className="animate-luxury grid gap-8 md:grid-cols-3">
              <StatCard icon={LayoutDashboard} label="Total Volume" value={`$${(bookings.reduce((acc, b) => acc + parseFloat(b.price || 0), 0)).toFixed(2)}`} />
              <StatCard icon={Users} label="Active Fleet" value={cars.length.toString()} />
              <StatCard icon={Calendar} label="New Requests" value={bookings.filter(b => b.status === "Pending").length.toString()} />
            </div>

            {/* Fleet Management */}
            <div className="animate-luxury grid gap-10 lg:grid-cols-[1fr_380px]" style={{ animationDelay: "0.2s" }}>
              <div className="glass overflow-hidden rounded-3xl shadow-luxury">
                <div className="border-b border-white/5 p-8 flex items-center justify-between bg-white/5">
                  <h2 className="text-gradient-gold text-2xl font-black uppercase tracking-widest">Fleet Control</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      <tr>
                        <th className="px-8 py-5">Vehicle Name</th>
                        <th className="px-8 py-5">Capacity</th>
                        <th className="px-8 py-5">Rate / KM</th>
                        <th className="px-8 py-5">Base</th>
                        <th className="px-8 py-5 text-right">Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {cars.map((car) => (
                        <tr key={car.id} className="transition-luxury hover:bg-white/5">
                          <td className="px-8 py-6 font-bold text-lg text-foreground">{car.name}</td>
                          <td className="px-8 py-6 text-muted-foreground font-medium">{car.passengers}P / {car.bags}B</td>
                          <td className="px-8 py-6 text-gold font-black">${car.price_per_km}</td>
                          <td className="px-8 py-6 text-muted-foreground font-medium">${car.base_price}</td>
                          <td className="px-8 py-6 text-right">
                            <button 
                              onClick={async () => {
                                if (confirm("Remove this vehicle from fleet?")) {
                                  const res = await deleteCar({ data: car.id });
                                  if (res.success) fetchData();
                                }
                              }}
                              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-muted-foreground transition-luxury hover:bg-destructive/20 hover:text-destructive ml-auto"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add New Car Form */}
              <div className="glass rounded-3xl p-8 shadow-luxury h-fit">
                <h3 className="mb-8 text-xl font-black uppercase tracking-widest text-gold">Add Vehicle</h3>
                <form onSubmit={handleAddCar} className="space-y-6">
                  <div>
                    <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-muted-foreground">Name & Model</label>
                    <input name="name" required className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium outline-none transition-luxury focus:border-gold/50 focus:bg-white/10" placeholder="e.g. Rolls Royce Ghost" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pax</label>
                      <input name="passengers" type="number" required className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium outline-none transition-luxury focus:border-gold/50 focus:bg-white/10" placeholder="4" />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-muted-foreground">Bags</label>
                      <input name="bags" type="number" required className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium outline-none transition-luxury focus:border-gold/50 focus:bg-white/10" placeholder="4" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-muted-foreground">$/KM</label>
                      <input name="pricePerKm" type="number" step="0.01" required className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium outline-none transition-luxury focus:border-gold/50 focus:bg-white/10" placeholder="5.00" />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-muted-foreground">Base $</label>
                      <input name="basePrice" type="number" step="0.01" required className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium outline-none transition-luxury focus:border-gold/50 focus:bg-white/10" placeholder="100.00" />
                    </div>
                  </div>
                  <button type="submit" className="bg-gradient-gold w-full rounded-xl py-5 text-sm font-black uppercase tracking-[0.2em] text-gold-foreground shadow-gold transition-luxury hover:scale-[1.02]">
                    Register Vehicle
                  </button>
                </form>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="animate-luxury glass overflow-hidden rounded-3xl shadow-luxury" style={{ animationDelay: "0.4s" }}>
              <div className="border-b border-white/5 p-8 bg-white/5">
                <h2 className="text-gradient-gold text-2xl font-black uppercase tracking-widest">Recent Reservations</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <tr>
                      <th className="px-8 py-5">Client Profile</th>
                      <th className="px-8 py-5">Itinerary</th>
                      <th className="px-8 py-5">Class</th>
                      <th className="px-8 py-5">Pickup Date</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5 text-right">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="transition-luxury hover:bg-white/5">
                        <td className="px-8 py-6">
                          <div className="font-bold text-lg text-foreground">{booking.first_name} {booking.last_name}</div>
                          <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{booking.email}</div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="font-medium text-foreground">{booking.pickup_location}</div>
                          <div className="text-xs font-bold text-gold uppercase mt-1">to {booking.dropoff_location}</div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="rounded-lg bg-gold/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-gold border border-gold/20">
                            {booking.vehicle_name}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-muted-foreground font-bold">{new Date(booking.pickup_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td className="px-8 py-6">
                          <span className={`rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest ${
                            booking.status === "Confirmed" ? "bg-emerald-500/10 text-emerald-500" : "bg-gold/10 text-gold"
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-gold transition-luxury hover:bg-gold hover:text-white ml-auto">
                            <Plus className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-8 py-20 text-center text-muted-foreground font-medium italic">No reservations found in vault.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="glass rounded-3xl p-8 shadow-luxury transition-luxury hover:translate-y-[-4px]">
      <div className="flex items-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-gold shadow-gold text-gold-foreground">
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
          <div className="text-3xl font-black text-foreground tracking-tighter mt-1">{value}</div>
        </div>
      </div>
    </div>
  );
}
