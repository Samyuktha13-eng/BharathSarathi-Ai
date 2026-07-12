import { connectDB } from "../lib/mongoose.js";
import { User } from "../lib/models.js";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  try {
    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ error: "Invalid email or password." });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid email or password." });
    res.json({ user: { id: user.id, name: user.name, email: user.email, lang: user.lang } });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Unable to connect. Please try again." });
  }
}
