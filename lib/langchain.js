import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.3,
});

export const askAI = async (systemPrompt, userMessage) => {
  const messages = userMessage
    ? [new SystemMessage(systemPrompt), new HumanMessage(userMessage)]
    : [new HumanMessage(systemPrompt)];
  const response = await model.invoke(messages);
  return response.content;
};
