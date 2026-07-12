import { askAI } from "../lib/langchain.js";
import { assistantPrompt } from "../lib/prompts.js";
import { connectDB } from "../lib/mongoose.js";
import { Chat } from "../lib/models.js";
import { generateComplaintId, currentTimestamp } from "../lib/utils.js";
import { checkRateLimit } from "../lib/rateLimiter.js";
import { sanitizeInput } from "../lib/sanitize.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
  try {
    await checkRateLimit(ip);
  } catch {
    return res.status(429).json({ error: "Too many requests. Please wait a minute." });
  }

  const { question, lang = "en" } = req.body;
  if (!question || typeof question !== "string" || question.trim().length === 0)
    return res.status(400).json({ error: "question is required" });

  if (question.length > 1000)
    return res.status(400).json({ error: "Question too long (max 1000 characters)" });

  let sanitized;
  try {
    sanitized = sanitizeInput(question);
  } catch {
    return res.status(400).json({ error: "Invalid input detected" });
  }

  try {
    const answer = await askAI(assistantPrompt(sanitized, lang));
    await connectDB();
    await Chat.create({ id: generateComplaintId(), question: sanitized, answer, lang, createdAt: currentTimestamp() });
    res.json({ answer });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ error: "Failed to process your question. Please try again." });
  }
}
