const injectionPatterns = [
  /ignore (previous|above|all) instructions/i,
  /you are now/i,
  /act as/i,
  /forget your (instructions|prompt|role)/i,
  /system prompt/i,
  /jailbreak/i,
  /pretend (you are|to be)/i,
  /disregard (all|previous|your)/i,
  /reveal your (prompt|instructions|rules|configuration)/i,
  /what are your (restrictions|rules|instructions)/i,
  /list (your|the) (restrictions|rules|instructions)/i,
  /describe your (role|prompt|instructions)/i,
  /what model (are you|powers you)/i,
  /you are (chatgpt|gpt|gemini|claude|llama)/i,
  /override (your|the) (instructions|rules|prompt)/i,
];

export const sanitizeInput = (text) => {
  for (const pattern of injectionPatterns) {
    if (pattern.test(text)) {
      throw new Error("Invalid input detected");
    }
  }
  return text.trim();
};
