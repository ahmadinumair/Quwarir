import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === "production";

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in the server environment.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function parseApiError(error: unknown): { status: number; message: string } {
  if (error && typeof error === "object") {
    const err = error as { status?: number; message?: string; error?: { code?: number; message?: string; status?: string } };
    const status = err.status || err.error?.code || 500;
    const rawMsg = err.message || err.error?.message || "Unexpected upstream API error.";
    if (status === 403 || rawMsg.includes("PERMISSION_DENIED") || rawMsg.includes("API_KEY_INVALID")) {
      return {
        status: 403,
        message: "API key permission error. Please verify your Gemini API key in the Settings > Secrets panel.",
      };
    }
    if (status === 429 || rawMsg.includes("RESOURCE_EXHAUSTED")) {
      return {
        status: 429,
        message: "Rate limit or quota reached. Paid-tier models (such as 1K/2K/4K image generation or carbon/argon reasoning) require a billing-enabled API key in Settings > Secrets.",
      };
    }
    return { status: typeof status === "number" ? status : 500, message: rawMsg };
  }
  return { status: 500, message: "An unexpected server error occurred." };
}

const ROLE_SYSTEM_INSTRUCTIONS: Record<string, string> = {
  shariah_methodology:
    "You are the QUWARIR Shariah Screening Methodology Guide. Explain Islamic financial screening principles clearly, objectively, and professionally (business activity screening, financial ratio thresholds such as debt and non-permissible income benchmarks, and purification concepts). Always remind users that QUWARIR provides educational information and analytical transparency—not personalized financial advice or official fatwa certification, and specific company compliance requires ongoing independent verification.",
  market_analyst:
    "You are the QUWARIR Global Market Intelligence Analyst. Provide institutional-grade, objective commentary on international equity markets including the Saudi Exchange (Tadawul), United States capital markets, and global Islamic finance trends. Do not claim any specific company is definitively Shariah-compliant without independent screening and regular verification, and do not provide trading execution or personalized investment advice.",
  islamic_educator:
    "You are the QUWARIR Islamic Financial Educator. Teach foundational concepts of Islamic finance—such as Riba (interest), Gharar (excessive uncertainty), Maysir (speculation), Sukuk, Murabaha, and ethical wealth stewardship—in crisp, accessible, authoritative prose suitable for international investors.",
};

const ALLOWED_CHAT_MODELS = new Set([
  "gemini-4-hydrogen",
  "gemini-3.1-flash-lite",
  "gemini-4-argon",
  "gemini-4-carbon",
]);

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "4mb" }));

  // Multi-turn Gemini chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const {
        message,
        history = [],
        role = "shariah_methodology",
        model = "gemini-4-hydrogen",
      } = req.body as {
        message?: string;
        history?: Array<{ role: "user" | "model"; text: string }>;
        role?: string;
        model?: string;
      };

      if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ error: "Please provide a non-empty message." });
      }

      const selectedModel = ALLOWED_CHAT_MODELS.has(model) ? model : "gemini-4-hydrogen";
      const systemInstruction =
        ROLE_SYSTEM_INSTRUCTIONS[role] || ROLE_SYSTEM_INSTRUCTIONS.shariah_methodology;

      const ai = getGeminiClient();

      const formattedHistory = Array.isArray(history)
        ? history
            .filter(
              (item) =>
                item &&
                (item.role === "user" || item.role === "model") &&
                typeof item.text === "string" &&
                item.text.trim().length > 0
            )
            .map((item) => ({
              role: item.role,
              parts: [{ text: item.text }],
            }))
        : [];

      const chat = ai.chats.create({
        model: selectedModel,
        history: formattedHistory,
        config: {
          systemInstruction,
        },
      });

      const response = await chat.sendMessage({ message: message.trim() });
      const reply = response.text?.trim();

      if (!reply) {
        return res.status(502).json({ error: "No response text was returned by the model." });
      }

      return res.json({ reply, model: selectedModel });
    } catch (error) {
      const parsed = parseApiError(error);
      return res.status(parsed.status).json({ error: parsed.message });
    }
  });

  // Text-to-Speech endpoint using gemini-3.8-flash-tts
  app.post("/api/tts", async (req, res) => {
    try {
      const {
        text,
        style = "Composed, authoritative institutional financial presenter with warm clarity",
        voiceName = "Charon",
      } = req.body as {
        text?: string;
        style?: string;
        voiceName?: string;
      };

      if (!text || typeof text !== "string" || !text.trim()) {
        return res.status(400).json({ error: "Text input is required for speech synthesis." });
      }

      const cleanText = text.trim().slice(0, 2200);
      const allowedVoices = new Set(["Puck", "Charon", "Kore", "Fenrir", "Zephyr"]);
      const selectedVoice = allowedVoices.has(voiceName) ? voiceName : "Charon";

      const ai = getGeminiClient();

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash-tts",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: cleanText,
                speechMetadata: {
                  style,
                },
              } as { text: string; speechMetadata?: { style?: string } },
            ],
          },
        ],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedVoice },
            },
          },
        },
      });

      const parts = response.candidates?.[0]?.content?.parts ?? [];
      let base64Audio: string | undefined;
      let mimeType = "audio/wav";

      for (const part of parts) {
        if (part.inlineData?.data) {
          base64Audio = part.inlineData.data;
          if (part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          break;
        }
      }

      if (!base64Audio) {
        return res.status(502).json({ error: "Speech synthesis did not return audio data." });
      }

      return res.json({
        audioBase64: base64Audio,
        mimeType,
        model: "gemini-3.8-flash-tts",
      });
    } catch (error) {
      const parsed = parseApiError(error);
      return res.status(parsed.status).json({ error: parsed.message });
    }
  });

  // High-resolution image generation endpoint using gemini-3-pro-image-preview
  app.post("/api/generate-image", async (req, res) => {
    try {
      const {
        prompt,
        imageSize = "1K",
        aspectRatio = "16:9",
      } = req.body as {
        prompt?: string;
        imageSize?: string;
        aspectRatio?: string;
      };

      if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
        return res.status(400).json({ error: "Please describe the visual concept to generate." });
      }

      const validSizes = new Set(["1K", "2K", "4K"]);
      const validRatios = new Set(["1:1", "3:4", "4:3", "9:16", "16:9"]);
      const selectedSize = validSizes.has(imageSize) ? imageSize : "1K";
      const selectedRatio = validRatios.has(aspectRatio) ? aspectRatio : "16:9";

      const ai = getGeminiClient();

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: {
          parts: [
            {
              text: `${prompt.trim()}. Minimalist luxury institutional financial aesthetic, deep emerald green (#103B2F) and brushed champagne gold (#C6A96B) palette, architectural precision, editorial photography.`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: selectedRatio,
            imageSize: selectedSize,
          },
        },
      });

      const parts = response.candidates?.[0]?.content?.parts ?? [];
      let imageDataUrl: string | null = null;
      let caption = "";

      for (const part of parts) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType ?? "image/png";
          imageDataUrl = `data:${mime};base64,${part.inlineData.data}`;
        } else if (part.text) {
          caption += part.text;
        }
      }

      if (!imageDataUrl) {
        return res.status(502).json({
          error: "No image was returned by gemini-3-pro-image-preview.",
        });
      }

      return res.json({
        imageDataUrl,
        caption: caption.trim(),
        imageSize: selectedSize,
        aspectRatio: selectedRatio,
        model: "gemini-3-pro-image-preview",
      });
    } catch (error) {
      const parsed = parseApiError(error);
      return res.status(parsed.status).json({ error: parsed.message });
    }
  });

  // Contact form inquiry endpoint
  app.post("/api/contact", (req, res) => {
    const { name, email, organization, topic, message } = req.body as {
      name?: string;
      email?: string;
      organization?: string;
      topic?: string;
      message?: string;
    };

    if (!name || !name.trim() || !email || !email.trim() || !message || !message.trim()) {
      return res.status(400).json({ error: "Name, email address, and message are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    return res.json({
      status: "received",
      referenceId: `QWR-${Date.now().toString(36).toUpperCase()}`,
      summary: {
        name: name.trim(),
        email: email.trim(),
        organization: organization?.trim() || "Individual Investor",
        topic: topic?.trim() || "General Inquiry",
      },
    });
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      const indexFile = path.join(distPath, "index.html");
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send("Application build not found.");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`QUWARIR server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start QUWARIR server:", err);
  process.exit(1);
});
