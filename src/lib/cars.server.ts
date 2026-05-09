import { createServerFn } from "@tanstack/react-start";

export const getCars = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const { query } = await import("./db.server");
      return await query("SELECT * FROM cars ORDER BY created_at DESC");
    } catch (err) {
      console.error("[Server] getCars DB error:", err);
      return [];
    }
  });

export const getHomeCars = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const { query } = await import("./db.server");
      return await query("SELECT * FROM cars ORDER BY created_at DESC LIMIT 2");
    } catch (err) {
      console.error("[Server] getHomeCars DB error:", err);
      return [];
    }
  });

export const addCar = createServerFn({ method: "POST" })
  .handler(async ({ data }: any) => {
    try {
      const { query } = await import("./db.server");
      await query(
        "INSERT INTO cars (name, image_url, passengers, bags, price_per_km, price_per_hour, base_price) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [data.name, data.imageUrl, data.passengers, data.bags, data.pricePerKm, data.pricePerHour, data.basePrice]
      );
      return { success: true };
    } catch (err: any) {
      console.error("[Server] addCar DB error:", err);
      return { success: false, error: err.message };
    }
  });

export const deleteCar = createServerFn({ method: "POST" })  .handler(async (ctx: any) => {
    const { data: id } = ctx;
    try {
      const { query } = await import("./db.server");
      await query("DELETE FROM cars WHERE id = ?", [id]);
      return { success: true };
    } catch (err: any) {
      console.error("[Server] deleteCar DB error:", err);
      return { success: false, error: err.message };
    }
  });
