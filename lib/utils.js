import { v4 as uuidv4 } from "uuid";

export const generateComplaintId = () =>
  `SB-${uuidv4().slice(0, 8).toUpperCase()}`;

export const currentTimestamp = () => new Date().toISOString();

export const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
