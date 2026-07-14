const email = "admin@queueless.com";
const password = "admin123password";
const name = "System Admin";

async function createAdmin() {
  try {
    console.log("Attempting to register Admin user...");
    const res = await fetch("http://localhost:5000/api/auth/sign-up/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "http://localhost:3000"
      },
      body: JSON.stringify({ email, password, name, role: "admin" })
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

createAdmin();
