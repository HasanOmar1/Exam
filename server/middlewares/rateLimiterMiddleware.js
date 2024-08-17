import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 1000, // 1 second window
  max: 5, // Limit each IP to 5 requests per second
  message: "Too many requests, please try again after a second",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
export default limiter;
