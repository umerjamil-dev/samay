import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Plus, X, ArrowLeftRight, Search, Hourglass } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

type Tab = "distance" | "hourly";

export function BookingWidget() {
  const [tab, setTab] = useState<Tab>("distance");
  const [extraStops, setExtraStops] = useState<string[]>([]);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const navigate = useNavigate();

  const [transferType, setTransferType] = useState("One Way");
  const [distance, setDistance] = useState("—");
  const [duration, setDuration] = useState("—");

  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [extraWaiting, setExtraWaiting] = useState("No Waiting");

  useEffect(() => {
    if (!pickup || !dropoff) {
      setDistance("—");
      setDuration("—");
      return;
    }

    const calculateRoute = async () => {
      const apiKey = "e9a54f7179d247c99d110f25b7bb50ac";
      try {
        const allPoints = [pickup, ...extraStops, dropoff].filter(Boolean);
        
        const coords = await Promise.all(
          allPoints.map(async (addr) => {
            const res = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addr)}&apiKey=${apiKey}`);
            const data = await res.json();
            return data.features?.[0]?.geometry?.coordinates; // [lon, lat]
          })
        );

        const validCoords = coords.filter(Boolean);
        if (validCoords.length >= 2) {
          const waypoints = validCoords.map(c => `${c[1]},${c[0]}`).join('|');
          const routeRes = await fetch(`https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=drive&apiKey=${apiKey}`);
          const routeData = await routeRes.json();

          if (routeData.features?.[0]?.properties) {
            const props = routeData.features[0].properties;
            setDistance(`${(props.distance / 1000).toFixed(1)} km`);
            setDuration(`${Math.round(props.time / 60)} min`);
          }
        }
      } catch (error) {
        console.error("Geoapify Error:", error);
      }
    };

    const timer = setTimeout(calculateRoute, 1000);
    return () => clearTimeout(timer);
  }, [pickup, dropoff, extraStops]);

  const locations =
    tab === "distance"
      ? [pickup, ...extraStops, dropoff].filter(Boolean)
      : [pickup, ...extraStops].filter(Boolean);
  const mapQuery = encodeURIComponent(locations.join(" to ") || "New York City");
  const mapSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  return (
    <div className="animate-luxury glass overflow-hidden rounded-3xl border border-white/5 shadow-luxury">
      <div className="grid grid-cols-2">
        {(["distance", "hourly"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-8 py-5 text-xs font-black uppercase tracking-[0.2em] transition-luxury ${
              tab === t
                ? "bg-gradient-gold text-gold-foreground"
                : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-gold"
            }`}
          >
            {t === "distance" ? "Distance Service" : "Hourly Service"}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_1.1fr]">
        {/* Left: Inputs */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ 
              to: "/booking",
              search: {
                tab,
                pickupDate,
                pickupTime,
                pickup,
                dropoff,
                transferType,
                extraWaiting,
                returnDate,
                returnTime,
                distance,
                duration
              }
            } as any);
          }}
          className="grid gap-6 p-8"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Field icon={Calendar} label="Departure Date" type="date" required value={pickupDate} onChange={setPickupDate} />
            <Field icon={Clock} label="Pickup Time" type="time" required value={pickupTime} onChange={setPickupTime} />
          </div>

          <Field
            icon={MapPin}
            label="Pickup Address"
            placeholder="Search pickup location..."
            required
            value={pickup}
            onChange={setPickup}
          />

          {tab === "distance" && (
            <>
              {extraStops.map((val, idx) => (
                <div key={idx} className="flex items-end gap-3 animate-luxury">
                  <div className="flex-1">
                    <Field
                      icon={MapPin}
                      label={`Extra Stop ${idx + 1}`}
                      placeholder="Enter stop address"
                      value={val}
                      onChange={(v) =>
                        setExtraStops(extraStops.map((s, i) => (i === idx ? v : s)))
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setExtraStops(extraStops.filter((_, i) => i !== idx))}
                    className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition-luxury hover:bg-destructive/20 hover:text-destructive"
                    aria-label="Remove stop"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setExtraStops([...extraStops, ""])}
                className="flex items-center gap-2 self-start text-xs font-bold uppercase tracking-widest text-gold hover:text-gold-light transition-luxury"
              >
                <Plus className="h-4 w-4" /> Add Multi-Stop
              </button>
            </>
          )}

          <Field
            icon={MapPin}
            label="Drop-Off Destination"
            placeholder="Search destination..."
            required
            value={dropoff}
            onChange={setDropoff}
          />

          {tab === "distance" ? (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label icon={ArrowLeftRight}>Service Mode</Label>
                  <select
                    value={transferType}
                    onChange={(e) => setTransferType(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 font-medium text-foreground outline-none transition-luxury focus:border-gold/50 focus:bg-white/10"
                  >
                    <option className="bg-card">One Way</option>
                    <option className="bg-card">Return Journey</option>
                  </select>
                </div>
                <div>
                  <Label icon={Hourglass}>Waiting Duration</Label>
                  <select 
                    value={extraWaiting}
                    onChange={(e) => setExtraWaiting(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 font-medium text-foreground outline-none transition-luxury focus:border-gold/50 focus:bg-white/10"
                  >
                    <option className="bg-card">No Waiting</option>
                    {[1, 2, 3, 4, 5, 6].map((h) => (
                      <option key={h} value={`${h} Hour${h > 1 ? "s" : ""}`} className="bg-card">{h} Hour{h > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </div>
              </div>

              {transferType === "Return Journey" && (
                <div className="grid gap-6 md:grid-cols-2 animate-luxury">
                  <Field icon={Calendar} label="Return Date" type="date" required value={returnDate} onChange={setReturnDate} />
                  <Field icon={Clock} label="Return Time" type="time" required value={returnTime} onChange={setReturnTime} />
                </div>
              )}
            </>
          ) : (
            <div>
              <Label icon={Clock}>Hourly Duration</Label>
              <select className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 font-medium text-foreground outline-none transition-luxury focus:border-gold/50 focus:bg-white/10">
                {[2, 3, 4, 5, 6, 8, 10, 12].map((h) => (
                  <option key={h} className="bg-card">{h} hours</option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            className="bg-gradient-gold mt-4 flex items-center justify-center gap-3 rounded-xl py-5 text-sm font-black uppercase tracking-[0.2em] text-gold-foreground shadow-gold transition-luxury hover:scale-[1.02]"
          >
            <Search className="h-5 w-5" /> Calculate Fare
          </button>
        </form>

        {/* Right: Map */}
        <div className="relative min-h-[500px] border-t border-white/5 lg:border-l lg:border-t-0">
          <iframe
            key={mapSrc}
            title="Route map"
            src={mapSrc}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background via-transparent to-transparent" />
          
          <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-6 glass border-t border-white/5 p-8 backdrop-blur-2xl">
            <div className="animate-luxury">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Total Distance</div>
              <div className="text-gradient-gold text-3xl font-black tracking-tighter mt-1">{distance}</div>
            </div>
            <div className="animate-luxury" style={{ animationDelay: "0.1s" }}>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Est. Time</div>
              <div className="text-gradient-gold text-3xl font-black tracking-tighter mt-1">{duration}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <label className="mb-2.5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">
      <Icon className="h-3.5 w-3.5 text-gold" /> {children}
    </label>
  );
}

function Field({
  icon: Icon, label, type = "text", placeholder, required, value, onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (v: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchSuggestions = async (text: string) => {
    if (!onChange || text.length < 3) {
      setSuggestions([]);
      return;
    }
    const apiKey = "e9a54f7179d247c99d110f25b7bb50ac";
    try {
      const res = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&apiKey=${apiKey}`);
      const data = await res.json();
      setSuggestions(data.features || []);
      setIsOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <Label icon={Icon}>{label}</Label>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        maxLength={200}
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          if (onChange) onChange(val);
          fetchSuggestions(val);
        }}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 font-medium text-foreground outline-none transition-luxury focus:border-gold/50 focus:bg-white/10"
      />
      
      {isOpen && suggestions.length > 0 && (
        <div className="glass absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-white/10 p-2 shadow-luxury backdrop-blur-3xl animate-luxury">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (onChange) onChange(s.properties.formatted);
                setIsOpen(false);
              }}
              className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition-luxury hover:bg-gold/10 hover:text-gold"
            >
              {s.properties.formatted}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
