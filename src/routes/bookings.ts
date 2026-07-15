import { Router, Request, Response } from "express";
import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

// Create a new booking (Book Token)
router.post("/", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { serviceId, userId, userName } = req.body;

    if (!serviceId || !userId || !userName) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      res.status(404).json({ error: "Service not found" });
      return;
    }

    // Get today's bookings for this service to determine token number
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await Booking.countDocuments({
      serviceId,
      createdAt: { $gte: today }
    });

    const tokenNumber = count + 1;

    // Check if token limit exceeded
    if (tokenNumber > service.maxTokens) {
      res.status(400).json({ error: "Daily token limit reached for this service." });
      return;
    }

    const newBooking = new Booking({
      serviceId,
      userId,
      userName,
      tokenNumber,
      status: "pending"
    });

    await newBooking.save();

    // Increment total tokens in Service model
    await Service.findByIdAndUpdate(serviceId, { $inc: { totalTokens: 1 } });

    res.status(201).json(newBooking);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create booking" });
  }
});

// Get bookings (filtered by userId or serviceId)
router.get("/", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, serviceId } = req.query;
    let filter: any = {};

    if (userId) filter.userId = String(userId);
    if (serviceId) filter.serviceId = String(serviceId);

    const bookings = await Booking.find(filter)
      .populate("serviceId")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch bookings" });
  }
});

// Update booking status (e.g. Cancel Booking)
router.patch("/:id", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'served', 'cancelled'].includes(status)) {
      res.status(400).json({ error: "Invalid status update" });
      return;
    }

    const updated = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update booking" });
  }
});

export default router;
