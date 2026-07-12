import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: { type: String, unique: true },
  password: String,
  lang: { type: String, default: "en" },
  createdAt: String,
});

const chatSchema = new mongoose.Schema({
  id: String,
  userId: String,
  question: String,
  answer: String,
  lang: String,
  createdAt: String,
});

const schemeSchema = new mongoose.Schema({
  id: String,
  userId: String,
  age: String,
  income: String,
  occupation: String,
  state: String,
  gender: String,
  lang: String,
  schemes: String,
  createdAt: String,
});

const complaintSchema = new mongoose.Schema({
  id: String,
  userId: String,
  name: String,
  location: String,
  description: String,
  formalComplaint: String,
  status: { type: String, default: "Submitted" },
  lang: String,
  createdAt: String,
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
export const Scheme = mongoose.models.Scheme || mongoose.model("Scheme", schemeSchema);
export const Complaint = mongoose.models.Complaint || mongoose.model("Complaint", complaintSchema);
