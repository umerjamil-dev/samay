import { createServerFn } from "@tanstack/react-start";
import type { ResultSetHeader } from "mysql2";

export const getBookings = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const { query } = await import("./db.server");
      return await query("SELECT * FROM bookings ORDER BY created_at DESC");
    } catch (err) {
      console.error("[Server] getBookings DB error:", err);
      return [];
    }
  });

export const createBooking = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    try {
      const { query } = await import("./db.server");

      // Validate required fields before hitting DB
      if (!data.firstName || !data.lastName || !data.email || !data.phone) {
        return { success: false, error: "Missing required passenger details" };
      }
      if (!data.pickup || !data.dropoff) {
        return { success: false, error: "Missing pickup or dropoff location" };
      }

      // Safe fallbacks for date/time (NOT NULL columns)
      const pickupDate = data.pickupDate || new Date().toISOString().slice(0, 10);
      const pickupTime = data.pickupTime || '00:00:00';

      const result = await query(
        `INSERT INTO bookings (
          pickup_date, pickup_time, pickup_location, dropoff_location, 
          transfer_type, return_date, return_time, extra_waiting, 
          distance, duration, passengers, bags, vehicle_name, 
          price, first_name, last_name, email, phone, flight_number, comments
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          pickupDate, pickupTime, data.pickup, data.dropoff,
          data.transferType || 'One Way', data.returnDate || null, data.returnTime || null, data.extraWaiting || null,
          data.distance || null, data.duration || null, data.passengers || 1, data.bags || 1,
          data.selectedCar?.name || 'Unknown', data.selectedCar?.price || 0,
          data.firstName, data.lastName, data.email, data.phone,
          data.flightNumber || null, data.comments || null
        ]
      ) as ResultSetHeader;

      return { success: true, bookingId: result.insertId };
    } catch (error: any) {
      console.error("Booking failed:", error);
      return { success: false, error: error?.message || error?.sqlMessage || String(error) || "Failed to save booking" };
    }
  });

export const updateBookingStatus = createServerFn({ method: "POST" })
  .handler(async ({ data }: any) => {
    try {
      const { query } = await import("./db.server");
      await query("UPDATE bookings SET status = ? WHERE id = ?", [data.status, data.id]);
      return { success: true };
    } catch (err: any) {
      console.error("[Server] updateBookingStatus DB error:", err);
      return { success: false, error: err.message };
    }
  });

