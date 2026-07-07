import { askAI } from "../lib/langchain.js";
import { complaintPrompt } from "../lib/prompts.js";
import { connectDB } from "../lib/mongoose.js";
import { Complaint } from "../lib/models.js";
import { generateComplaintId, currentTimestamp } from "../lib/utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { name, description, location, lang = "en" } = req.body;
  if (!description || !location)
    return res.status(400).json({ error: "description and location are required" });

  const formalComplaint = await askAI(complaintPrompt(description, location, lang));
  const id = generateComplaintId();

  await connectDB();
  await Complaint.create({ id, name: name || "Anonymous", location, description, formalComplaint, status: "Submitted", lang, createdAt: currentTimestamp() });

  res.json({ complaintId: id, formalComplaint, status: "Submitted" });
}
