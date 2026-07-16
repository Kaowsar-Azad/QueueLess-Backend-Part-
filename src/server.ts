import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { connectDB, auth } from './config/db.js';
import { toNodeHandler } from "better-auth/node";
import serviceRoutes from './routes/services.js';
import bookingRoutes from './routes/bookings.js';
import adminRoutes from './routes/admin.js';
import reviewsRoutes from './routes/reviews.js';

const app: Application = express();

app.set("trust proxy", 1);

app.use(cors({
    origin: process.env.CLIENT_URL
        ? [process.env.CLIENT_URL, "http://localhost:3000"]
        : "http://localhost:3000",
    credentials: true,
}));

// Middleware to ensure DB is connected before processing any request
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("DB connection failed:", err);
        next(); // Let routes handle their own errors
    }
});

app.use(express.json());

app.use("/api/auth", toNodeHandler(auth));
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewsRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('QueueLess API is running with Better Auth & MongoDB...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
