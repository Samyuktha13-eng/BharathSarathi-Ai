import { askAI } from "../lib/langchain.js";
import { schemePrompt } from "../lib/prompts.js";
import { connectDB } from "../lib/mongoose.js";
import { Scheme } from "../lib/models.js";
import { generateComplaintId, currentTimestamp } from "../lib/utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { age, income, occupation, state, gender, lang = "en" } = req.body;
  if (!age || !income || !occupation || !state)
    return res.status(400).json({ error: "age, income, occupation, state are required" });

  const ageNum = Number(age);
  if (isNaN(ageNum) || ageNum < 1 || ageNum > 120)
    return res.status(400).json({ error: "Invalid age value" });

  try {
    const schemes = await askAI(schemePrompt({ age, income, occupation, state, gender, lang }));
    await connectDB();
    await Scheme.create({ id: generateComplaintId(), age, income, occupation, state, gender: gender || "Not specified", lang, schemes, createdAt: currentTimestamp() });
    res.json({ schemes });
  } catch (err) {
    console.error("Schemes error:", err.message);
    res.status(500).json({ error: "Failed to find schemes. Please try again." });
  }
}
