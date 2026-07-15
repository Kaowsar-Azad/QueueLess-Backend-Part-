import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import Service from "../models/Service.js";
import Booking from "../models/Booking.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/stats", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      res.status(500).json({ error: "Database connection not ready" });
      return;
    }

    const userCollection = db.collection("user");

    // Count users with role 'user'
    const totalUsers = await userCollection.countDocuments({ role: "user" });

    // Count users with role 'owner'
    const totalOwners = await userCollection.countDocuments({ role: "owner" });

    // Count all services
    const totalServices = await Service.countDocuments({});

    // Count all bookings (queues processed/requested)
    const totalBookings = await Booking.countDocuments({});

    res.json({
      totalUsers,
      totalOwners,
      totalServices,
      totalBookings
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch admin stats" });
  }
});

export default router;
