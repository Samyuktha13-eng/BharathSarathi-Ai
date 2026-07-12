import { franc } from "franc-min";

// Maps franc ISO 639-3 codes to readable names
const FRANC_MAP = {
  hin: "Hindi",
  tam: "Tamil",
  tel: "Telugu",
  ben: "Bengali",
  mar: "Marathi",
  guj: "Gujarati",
  kan: "Kannada",
  mal: "Malayalam",
  pan: "Punjabi",
  eng: "English",
  und: "Unknown",
};

// Detect if text contains Devanagari, Tamil, Telugu, Bengali, Kannada, Gujarati scripts
const SCRIPT_PATTERNS = {
  Hindi:     /[\u0900-\u097F]/,
  Tamil:     /[\u0B80-\u0BFF]/,
  Telugu:    /[\u0C00-\u0C7F]/,
  Bengali:   /[\u0980-\u09FF]/,
  Kannada:   /[\u0C80-\u0CFF]/,
  Gujarati:  /[\u0A80-\u0AFF]/,
  Punjabi:   /[\u0A00-\u0A7F]/,
  Malayalam: /[\u0D00-\u0D7F]/,
};

export const detectInputLanguage = (text) => {
  // 1. Check for native scripts first (most reliable)
  for (const [lang, pattern] of Object.entries(SCRIPT_PATTERNS)) {
    if (pattern.test(text)) {
      // Check if it also has English (mixed/transliterated)
      const hasEnglish = /[a-zA-Z]{3,}/.test(text);
      return hasEnglish ? `${lang}-English mix (${lang}lish)` : lang;
    }
  }

  // 2. Use franc for transliterated text (Hinglish, Tanglish written in Roman script)
  const detected = franc(text, { minLength: 3 });
  const langName = FRANC_MAP[detected];

  // 3. If franc says English or unknown, check for common Indian transliteration patterns
  if (!langName || langName === "English" || langName === "Unknown") {
    const hinglishPatterns = /\b(kya|hai|hain|mera|tera|aur|nahi|kaise|kahan|kyun|bhai|yaar|accha|theek|bahut|bohot|sarkari|sarkar)\b/i;
    const tanglishPatterns = /\b(enna|epdi|inge|ange|naan|nee|avan|aval|romba|konjam|sollu|paru|paaru|vanakkam)\b/i;
    const tenglishPatterns = /\b(enti|emiti|ela|evaru|ekkada|cheppandi|cheyandi|meeru|mee|memu|anni|chala)\b/i;
    const benglishPatterns = /\b(ami|tumi|apni|kothay|kemon|achho|bolo|jano|dekho|shunun|dada|didi)\b/i;

    if (hinglishPatterns.test(text)) return "Hinglish (Hindi+English)";
    if (tanglishPatterns.test(text)) return "Tanglish (Tamil+English)";
    if (tenglishPatterns.test(text)) return "Tenglish (Telugu+English)";
    if (benglishPatterns.test(text)) return "Benglish (Bengali+English)";

    return "English";
  }

  return langName;
};
