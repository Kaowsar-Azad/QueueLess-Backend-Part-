import { Router, Request, Response } from "express";
import Review from "../models/Review.js";
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
