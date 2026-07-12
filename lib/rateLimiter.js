import { RateLimiterMemory } from "rate-limiter-flexible";

const limiter = new RateLimiterMemory({
  points: 20,    // 20 requests
  duration: 60,  // per 60 seconds per IP
});

export const checkRateLimit = async (ip) => {
  await limiter.consume(ip);
};
