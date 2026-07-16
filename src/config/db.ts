import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    throw new Error("MONGODB_URI is missing in .env file");
}

// --- Connection Caching for Serverless (Vercel) ---
// In serverless, modules can be reused between invocations.
// We cache the client promise to avoid creating new connections on every request.
let cachedClient: MongoClient | null = null;
let cachedClientPromise: Promise<MongoClient> | null = null;
let mongooseConnected = false;

async function getConnectedClient(): Promise<MongoClient> {
    if (cachedClient && cachedClientPromise) {
        return cachedClientPromise;
    }
    const newClient = new MongoClient(mongoURI as string);
    cachedClientPromise = newClient.connect().then(() => {
        cachedClient = newClient;
        return newClient;
    });
    return cachedClientPromise;
}

// Create initial client synchronously for Better Auth adapter setup
const client = new MongoClient(mongoURI);
const db = client.db(process.env.MONGODB_DB_NAME || "QueueLess-Project");

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000/api/auth",
    trustedOrigins: process.env.CLIENT_URL
        ? [process.env.CLIENT_URL, "http://localhost:3000"]
        : ["http://localhost:3000"],
    database: mongodbAdapter(db, {
        client: client
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "user"
            }
        }
    },
    advanced: {
        defaultCookieAttributes: {
            sameSite: "none",
            secure: true
        }
    }
});

export const connectDB = async (): Promise<void> => {
    try {
        // Connect Better Auth MongoDB client
        if (!cachedClient) {
            await getConnectedClient();
            // Sync the shared client too
            await client.connect();
        }
        
        // Connect Mongoose (for service/booking routes)
        if (!mongooseConnected && mongoose.connection.readyState === 0) {
            await mongoose.connect(mongoURI as string, {
                dbName: process.env.MONGODB_DB_NAME || "QueueLess-Project"
            });
            mongooseConnected = true;
        }
        
        console.log(`✅ MongoDB Connected via Mongoose & Better Auth Adapter`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB:`, error);
        // Do not process.exit(1) in Serverless environments
    }
};
