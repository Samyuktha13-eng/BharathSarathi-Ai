import { connectDB } from "../lib/mongoose.js";
import { User } from "../lib/models.js";
import { currentTimestamp, generateComplaintId } from "../lib/utils.js";
import bcrypt from "bcryptjs";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const nameRe = /^[a-zA-Z\s]{2,}$/;

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { name, email, password, lang = "en" } = req.body;

  if (!nameRe.test(name))
    return res.status(400).json({ error: "Name must contain only letters (min 2 chars)." });
  if (!emailRe.test(email))
    return res.status(400).json({ error: "Invalid email address." });
  if (!passwordRe.test(password))
    return res.status(400).json({ error: "Password must be 8+ chars with uppercase, lowercase, number and special character." });

  try {
    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing)
      return res.status(409).json({ error: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      id: generateComplaintId(), name, email: email.toLowerCase().trim(), password: hashedPassword, lang,
      createdAt: currentTimestamp(),
    });

    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, lang: user.lang } });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: err.message });
  }
}
