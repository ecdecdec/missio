import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function run() {
  const key = process.env.AZURE_OPENAI_API_KEY;
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT?.replace(/\/+$/, "");
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-5.1";
  
  // Clean version if there are quotes
  const rawVersion = process.env.AZURE_API_VERSION || "2025-03-01-preview";
  const apiVersion = rawVersion.replace(/"/g, "").trim();

  console.log("Testing Azure API connection...");
  console.log("Endpoint:", endpoint);
  console.log("Deployment:", deployment);
  console.log("API Version:", apiVersion);
  console.log("Key Length:", key ? key.length : 0);

  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": key || "",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "hi" },
        ],
        temperature: 0.7,
        max_completion_tokens: 100,
      }),
    });

    console.log("Response Status:", res.status);
    console.log("Response Status Text:", res.statusText);
    
    const body = await res.text();
    console.log("Response Body:", body);
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

run();
