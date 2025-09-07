import rateLimit from 'express-rate-limit';
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 50, 
  standardHeaders: true,
  legacyHeaders: false, 
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again after a minute.'
  }
});

export default globalLimiter;
