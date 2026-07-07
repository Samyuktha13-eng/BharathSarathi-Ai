import { randomUUID } from "crypto";

export const generateComplaintId = () =>
  `SB-${randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()}`;

export const currentTimestamp = () => new Date().toISOString();

export const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
