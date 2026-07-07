import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DB_PATH = join(process.cwd(), "data/db.json");

export const readDB = () => JSON.parse(readFileSync(DB_PATH, "utf-8"));

export const writeDB = (data) =>
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

export const saveChatHistory = (entry) => {
  const db = readDB();
  db.chatHistory.unshift(entry);
  writeDB(db);
};

export const saveSchemeHistory = (entry) => {
  const db = readDB();
  db.schemeHistory.unshift(entry);
  writeDB(db);
};
