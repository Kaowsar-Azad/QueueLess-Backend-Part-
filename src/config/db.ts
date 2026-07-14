import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import dotenv from "dotenv";


dotenv.config();

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    throw new Error("MONGODB_URI is missing in .env file");
}


const client = new MongoClient(mongoURI);


const db = client.db(process.env.MONGODB_DB_NAME || "QueueLess-Project");


export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client: client 
    }),
    emailAndPassword: {
        enabled: true,
    },
    
});

export const connectDB = async (): Promise<void> => {
    try {
        await client.connect();
        console.log(`✅ MongoDB Connected via Better Auth Adapter`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB:`, error);
        process.exit(1);
    }
};
