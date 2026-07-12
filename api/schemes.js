import { askAI } from "../lib/langchain.js";
import { schemePrompt } from "../lib/prompts.js";
import { connectDB } from "../lib/mongoose.js";
import { Scheme } from "../lib/models.js";
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

  const { age, income, occupation, state, gender, lang = "en" } = req.body;
  if (!age || !income || !occupation || !state)
    return res.status(400).json({ error: "age, income, occupation, state are required" });

  const ageNum = Number(age);
  if (isNaN(ageNum) || ageNum < 1 || ageNum > 120)
    return res.status(400).json({ error: "Invalid age value" });

  let sanitizedIncome, sanitizedOccupation, sanitizedState;
  try {
    sanitizedIncome = sanitizeInput(String(income));
    sanitizedOccupation = sanitizeInput(String(occupation));
    sanitizedState = sanitizeInput(String(state));
  } catch {
    return res.status(400).json({ error: "Invalid input detected" });
  }

  try {
    const schemes = await askAI(schemePrompt({ age, income: sanitizedIncome, occupation: sanitizedOccupation, state: sanitizedState, gender, lang }));
    await connectDB();
    await Scheme.create({ id: generateComplaintId(), age, income: sanitizedIncome, occupation: sanitizedOccupation, state: sanitizedState, gender: gender || "Not specified", lang, schemes, createdAt: currentTimestamp() });
    res.json({ schemes });
  } catch (err) {
    console.error("Schemes error:", err.message);
    res.status(500).json({ error: "Failed to find schemes. Please try again." });
  }
}
