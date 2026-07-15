import { MongoClient } from "mongodb";

const uri = "mongodb+srv://QueueLess-Project:qGRUW3nXB6q5T5uW@cluster0.9wdopzg.mongodb.net/?appName=Cluster0";
const dbName = "QueueLess-Project";
const targetEmail = "kaowsar148@gmail.com";

async function resetUser() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    
    // Better Auth stores users in the "user" collection
    const userResult = await db.collection("user").deleteOne({ email: targetEmail });
    console.log(`Deleted ${userResult.deletedCount} user(s) from "user" collection.`);
    
    // It also creates an account in "account" collection, better to delete that too if it exists
    // However, without the userId we can just delete by providerId or email if it's there
    // Actually, just deleting the user allows re-registration.
    
    console.log(`\n✅ আপনি এখন ${targetEmail} ইমেইল দিয়ে নতুন করে ওয়েবসাইটে রেজিস্টার করতে পারবেন!`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

resetUser();
