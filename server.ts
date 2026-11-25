import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Lazy initialize Gemini API client to prevent crashing on missing keys at startup
  let ai: GoogleGenAI | null = null;
  function getAI() {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("GEMINI_API_KEY is not set in environment variables.");
        return null;
      }
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return ai;
  }

  // API Route to proxy Gemini generation requests safely
  app.post("/api/gemini/generate", async (req, res) => {
    try {
      const { prompt, systemInstruction, modelName } = req.body;
      const client = getAI();
      if (!client) {
        return res.status(503).json({
          error: "Gemini API key is missing. Please open 'Settings > Secrets' and add your GEMINI_API_KEY to start using the model garden features."
        });
      }

      // Default to gemini-3.5-flash for general tasks
      const model = modelName || "gemini-3.5-flash";

      const response = await client.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "You are an assistant.",
          temperature: 0.75,
        },
      });

      return res.json({ text: response.text });
    } catch (err: any) {
      console.error("Gemini API error:", err);
      return res.status(500).json({ error: err.message || "Failed to query Gemini API" });
    }
  });

  // Serve Vite or static files based on environment
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
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
