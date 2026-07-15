import { Router, Request, Response } from "express";
import Service from "../models/Service.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

// Create a new service/queue
router.post("/", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, category, ownerId, ownerName, address, contactNumber, startHour, endHour, maxTokens } = req.body;
    
    if (!name || !description || !category || !ownerId || !ownerName || !address || !contactNumber || !startHour || !endHour) {
       res.status(400).json({ error: "Missing required fields" });
       return;
    }

    const newService = new Service({
      name,
      description,
      category,
      ownerId,
      ownerName,
      address,
      contactNumber,
      startHour,
      endHour,
      maxTokens: maxTokens ? parseInt(maxTokens) : 50
    });

    await newService.save();
    res.status(201).json(newService);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create service" });
  }
});

// Get all services or filter by ownerId
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { ownerId } = req.query;
    const filter = ownerId ? { ownerId: String(ownerId) } : {};
    
    const services = await Service.find(filter).sort({ createdAt: -1 });
    res.json(services);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch services" });
  }
});

// Get a single service by ID
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) {
      res.status(404).json({ error: "Service not found" });
      return;
    }
    res.json(service);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch service details" });
  }
});

// Delete a service
router.delete("/:id", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Service.findByIdAndDelete(id);
    if (!deleted) {
       res.status(404).json({ error: "Service not found" });
       return;
    }
    res.json({ message: "Service deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete service" });
  }
});

export default router;
