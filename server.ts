import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API Route: Hashtag Suggestions using Gemini
  app.post("/api/hashtag-suggestions", async (req, res) => {
    try {
      const { platform = "Instagram", topic = "technology", tone = "professional" } = req.body;

      let ai;
      try {
        ai = getGeminiClient();
      } catch (err: any) {
        // Return structured mock/default suggestions if GEMINI_API_KEY is not configured yet
        console.warn("Gemini client initialization failed:", err.message);
        const fallbackTags = [
          { tag: `#${topic.replace(/\s+/g, "")}`, category: "general", reachMultiplier: "High", explanation: "Direct match of your target topic." },
          { tag: `#${platform.toLowerCase()}growth`, category: "trending", reachMultiplier: "Viral", explanation: "Targeted to boost profile visibility." },
          { tag: `#${tone}${topic.replace(/\s+/g, "")}`, category: "industry-specific", reachMultiplier: "Medium", explanation: "Tailored to align with your chosen style tone." },
          { tag: `#linkify`, category: "niche", reachMultiplier: "High", explanation: "Promotes customized bio links." },
          { tag: "#linkinbio", category: "viral", reachMultiplier: "Viral", explanation: "High search-intent hashtag for social profiles." }
        ];
        return res.json({ suggestions: fallbackTags, isDemo: true });
      }

      const promptString = `Generate 5 highly engaging and optimized hashtags for a social media post on platform "${platform}" about "${topic}". The post tone is "${tone}". Ensure hashtag recommendations correspond to their specific categorizations, reach multipliers, and explain why each works.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptString,
        config: {
          systemInstruction: "You are an elite Social Media Growth strategist and marketing copywriter. You specialize in generating high-conversion hashtag recommendations that boost reach & engagement metrics. Always return clean JSON array adhering exactly to the requested schema structure.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                tag: { type: Type.STRING },
                category: { type: Type.STRING, description: "Type: e.g. general, industry-specific, trending, niche" },
                reachMultiplier: { type: Type.STRING, description: "e.g. High, Medium, Viral, Extremely High" },
                explanation: { type: Type.STRING, description: "Brief explanation of why it works for the post & tone." }
              },
              required: ["tag", "category", "reachMultiplier", "explanation"]
            }
          }
        }
      });

      const responseText = response.text || "[]";
      let suggestions = [];
      try {
        suggestions = JSON.parse(responseText.trim());
      } catch (parseErr) {
        console.error("Failed to parse Gemini response text:", responseText, parseErr);
        suggestions = [
          { tag: `#${topic.replace(/\s+/g, "")}`, category: "general", reachMultiplier: "High", explanation: "Direct match of your target topic." }
        ];
      }

      res.json({ suggestions, isDemo: false });
    } catch (error: any) {
      console.error("AI hashtag generation failed:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
