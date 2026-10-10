
import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const app = express();
const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/chat", async (req, res) => {
  try {
    const question = req.body.message;

    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        error: "Please enter a message."
      });
    }

    const response = await client.responses.create({
      model: "gemini-3.5-flash-lite",
      instructions:
        "You are Mil0 AI, a friendly customer service assistant. " +
        "Answer questions clearly and helpfully. " +
        "Never invent business prices or policies.",
      input: question
    });

    res.json({ reply: response.output_text });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "AI connection failed. Check your API key and model."
    });
  }
});

app.listen(3000, () => {
  console.log("Mil0 AI is running at http://localhost:3000");
});