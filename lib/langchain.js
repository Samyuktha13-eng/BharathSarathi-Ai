import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.7,
});

export const askAI = async (prompt) => {
  const response = await model.invoke([new HumanMessage(prompt)]);
  return response.content;
};
