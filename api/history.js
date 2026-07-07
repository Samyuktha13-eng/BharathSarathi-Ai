import { connectDB } from "../lib/mongoose.js";
import { Chat, Scheme, Complaint } from "../lib/models.js";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const [chatHistory, schemeHistory, complaints] = await Promise.all([
      Chat.find().sort({ createdAt: -1 }),
      Scheme.find().sort({ createdAt: -1 }),
      Complaint.find().sort({ createdAt: -1 }),
    ]);
    return res.json({
      stats: { totalChats: chatHistory.length, totalSchemes: schemeHistory.length, totalComplaints: complaints.length },
      chatHistory, schemeHistory, complaints,
    });
  }

  if (req.method === "DELETE") {
    const { type, id } = req.body;
    if (id) {
      if (type === "chat") await Chat.deleteOne({ id });
      if (type === "scheme") await Scheme.deleteOne({ id });
      if (type === "complaint") await Complaint.deleteOne({ id });
    } else {
      if (type === "chat" || type === "all") await Chat.deleteMany({});
      if (type === "scheme" || type === "all") await Scheme.deleteMany({});
      if (type === "complaint" || type === "all") await Complaint.deleteMany({});
    }
    return res.json({ success: true });
  }

  res.status(405).json({ error: "Method not allowed" });
}
