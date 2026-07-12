import { connectDB } from "../lib/mongoose.js";
import { Complaint } from "../lib/models.js";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const { id, userId } = req.query;
  await connectDB();

  const complaint = await Complaint.findOne({ id });
  if (!complaint)
    return res.status(404).json({ error: "Complaint not found" });
  if (userId && complaint.userId && complaint.userId !== userId)
    return res.status(403).json({ error: "Access denied" });

  res.json(complaint);
}
