import { askAI } from "../lib/langchain.js";
import { assistantPrompt } from "../lib/prompts.js";
import { connectDB } from "../lib/mongoose.js";
import { Chat } from "../lib/models.js";
import { generateComplaintId, currentTimestamp } from "../lib/utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { question, lang = "en" } = req.body;
  if (!question)
    return res.status(400).json({ error: "question is required" });

  const answer = await askAI(assistantPrompt(question, lang));

  await connectDB();
  await Chat.create({ id: generateComplaintId(), question, answer, lang, createdAt: currentTimestamp() });

  res.json({ answer });
}
