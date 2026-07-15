import { Router, Request, Response } from "express";
import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

// Create a new review
router.post("/", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { serviceId, userId, userName, rating, comment } = req.body;

    if (!serviceId || !userId || !userName || !rating || !comment) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Check if user has already reviewed this service
    const existingReview = await Review.findOne({ serviceId, userId });
    if (existingReview) {
      res.status(400).json({ error: "You have already submitted a review for this service." });
      return;
    }

    // Check if user has ever booked this service
    const hasBooked = await Booking.findOne({ serviceId, userId });
    if (!hasBooked) {
      res.status(403).json({ error: "You must book a token for this service before you can leave a review." });
      return;
    }

    const newReview = new Review({
      serviceId,
      userId,
      userName,
      rating,
      comment
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to submit review" });
  }
});

// Get all reviews for a specific service
router.get("/service/:serviceId", async (req: Request, res: Response): Promise<void> => {
  try {
    const { serviceId } = req.params;
    const reviews = await Review.find({ serviceId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch reviews" });
  }
});

export default router;
