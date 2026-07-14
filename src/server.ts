import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { connectDB, auth } from './config/db';
import { toNodeHandler } from "better-auth/node";

const app: Application = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());


connectDB();



app.use("/api/auth", toNodeHandler(auth));

app.get('/', (req: Request, res: Response) => {
    res.send('QueueLess API is running with Better Auth & MongoDB...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
