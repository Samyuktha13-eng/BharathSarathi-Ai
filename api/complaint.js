import { askAI } from "../lib/langchain.js";
import { complaintPrompt } from "../lib/prompts.js";
import { connectDB } from "../lib/mongoose.js";
import { Complaint } from "../lib/models.js";
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

  const { name, description, location, lang = "en" } = req.body;
  if (!description || !location)
    return res.status(400).json({ error: "description and location are required" });

  let sanitizedDesc, sanitizedLoc;
  try {
    sanitizedDesc = sanitizeInput(description);
    sanitizedLoc = sanitizeInput(location);
  } catch {
    return res.status(400).json({ error: "Invalid input detected" });
  }

  try {
    const formalComplaint = await askAI(complaintPrompt(sanitizedDesc, sanitizedLoc, lang));
    const id = generateComplaintId();
    await connectDB();
    await Complaint.create({ id, name: name || "Anonymous", location: sanitizedLoc, description: sanitizedDesc, formalComplaint, status: "Submitted", lang, createdAt: currentTimestamp() });
    res.json({ complaintId: id, formalComplaint, status: "Submitted" });
  } catch (err) {
    console.error("Complaint error:", err.message);
    res.status(500).json({ error: "Failed to submit complaint. Please try again." });
  }
}
