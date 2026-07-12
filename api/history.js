import { connectDB } from "../lib/mongoose.js";
import { Chat, Scheme, Complaint } from "../lib/models.js";

export default async function handler(req, res) {
  await connectDB();

  const userId = req.query.userId || req.body?.userId;
  if (!userId) return res.status(400).json({ error: "userId is required" });

  if (req.method === "GET") {
    const [chatHistory, schemeHistory, complaints] = await Promise.all([
      Chat.find({ userId }).sort({ createdAt: -1 }),
      Scheme.find({ userId }).sort({ createdAt: -1 }),
      Complaint.find({ userId }).sort({ createdAt: -1 }),
    ]);
    return res.json({
      stats: { totalChats: chatHistory.length, totalSchemes: schemeHistory.length, totalComplaints: complaints.length },
      chatHistory, schemeHistory, complaints,
    });
  }

  if (req.method === "DELETE") {
    const { type, id } = req.body;
    if (id) {
      if (type === "chat") await Chat.deleteOne({ id, userId });
      if (type === "scheme") await Scheme.deleteOne({ id, userId });
      if (type === "complaint") await Complaint.deleteOne({ id, userId });
    } else {
      if (type === "chat" || type === "all") await Chat.deleteMany({ userId });
      if (type === "scheme" || type === "all") await Scheme.deleteMany({ userId });
      if (type === "complaint" || type === "all") await Complaint.deleteMany({ userId });
    }
    return res.json({ success: true });
  }

  res.status(405).json({ error: "Method not allowed" });
}
