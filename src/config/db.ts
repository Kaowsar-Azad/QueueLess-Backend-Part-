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


const client = new MongoClient(mongoURI);


const db = client.db(process.env.MONGODB_DB_NAME || "QueueLess-Project");


export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000/api/auth",
    trustedOrigins: process.env.CLIENT_URL ? [process.env.CLIENT_URL, "http://localhost:3000"] : ["http://localhost:3000"],
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
        await client.connect();
        await mongoose.connect(mongoURI, {
            dbName: process.env.MONGODB_DB_NAME || "QueueLess-Project"
        });
        console.log(`✅ MongoDB Connected via Mongoose & Better Auth Adapter`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB:`, error);
        // Do not process.exit(1) in Serverless environments
    }
};
