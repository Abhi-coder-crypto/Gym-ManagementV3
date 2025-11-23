import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  return value ? parseInt(value, 10) : defaultValue;
};

const getEnvString = (key: string, defaultValue: string): string => {
  return process.env[key] || defaultValue;
};

export const loginRateLimiter = rateLimit({
  windowMs: getEnvNumber('RATE_LIMIT_LOGIN_WINDOW_MS', 15 * 60 * 1000),
  max: getEnvNumber('RATE_LIMIT_LOGIN_MAX', 5),
  message: {
    error: 'Too many login attempts from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req: Request, res: Response) => {
    console.log(`🚫 Rate limit exceeded for login`);
    res.status(429).json({
      error: 'Too many login attempts from this IP, please try again after 15 minutes',
      retryAfter: Math.ceil(getEnvNumber('RATE_LIMIT_LOGIN_WINDOW_MS', 15 * 60 * 1000) / 1000)
    });
  }
});

export const uploadRateLimiter = rateLimit({
  windowMs: getEnvNumber('RATE_LIMIT_UPLOAD_WINDOW_MS', 60 * 60 * 1000),
  max: getEnvNumber('RATE_LIMIT_UPLOAD_MAX', 50),
  message: {
    error: 'Too many file uploads, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
  handler: (req: Request, res: Response) => {
    console.log(`🚫 Rate limit exceeded for upload`);
    res.status(429).json({
      error: 'Too many file uploads, please try again later',
      retryAfter: Math.ceil(getEnvNumber('RATE_LIMIT_UPLOAD_WINDOW_MS', 60 * 60 * 1000) / 1000)
    });
  }
});

export const paymentWebhookRateLimiter = rateLimit({
  windowMs: getEnvNumber('RATE_LIMIT_WEBHOOK_WINDOW_MS', 60 * 1000),
  max: getEnvNumber('RATE_LIMIT_WEBHOOK_MAX', 100),
  message: {
    error: 'Too many webhook requests'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.log(`🚫 Rate limit exceeded for webhook`);
    res.status(429).json({
      error: 'Too many webhook requests',
      retryAfter: Math.ceil(getEnvNumber('RATE_LIMIT_WEBHOOK_WINDOW_MS', 60 * 1000) / 1000)
    });
  }
});

export const signupRateLimiter = rateLimit({
  windowMs: getEnvNumber('RATE_LIMIT_SIGNUP_WINDOW_MS', 60 * 60 * 1000),
  max: getEnvNumber('RATE_LIMIT_SIGNUP_MAX', 3),
  message: {
    error: 'Too many accounts created from this IP, please try again after an hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.log(`🚫 Rate limit exceeded for signup`);
    res.status(429).json({
      error: 'Too many accounts created from this IP, please try again after an hour',
      retryAfter: Math.ceil(getEnvNumber('RATE_LIMIT_SIGNUP_WINDOW_MS', 60 * 60 * 1000) / 1000)
    });
  }
});

export const passwordResetRateLimiter = rateLimit({
  windowMs: getEnvNumber('RATE_LIMIT_PASSWORD_RESET_WINDOW_MS', 60 * 60 * 1000),
  max: getEnvNumber('RATE_LIMIT_PASSWORD_RESET_MAX', 3),
  message: {
    error: 'Too many password reset attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.log(`🚫 Rate limit exceeded for password reset`);
    res.status(429).json({
      error: 'Too many password reset attempts, please try again later',
      retryAfter: Math.ceil(getEnvNumber('RATE_LIMIT_PASSWORD_RESET_WINDOW_MS', 60 * 60 * 1000) / 1000)
    });
  }
});

export const generalApiRateLimiter = rateLimit({
  windowMs: getEnvNumber('RATE_LIMIT_GENERAL_WINDOW_MS', 15 * 60 * 1000),
  max: getEnvNumber('RATE_LIMIT_GENERAL_MAX', 1000),
  message: {
    error: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.log(`🚫 Rate limit exceeded for general API`);
    res.status(429).json({
      error: 'Too many requests, please try again later',
      retryAfter: Math.ceil(getEnvNumber('RATE_LIMIT_GENERAL_WINDOW_MS', 15 * 60 * 1000) / 1000)
    });
  }
});

console.log('🛡️  Rate limiting middleware initialized');
console.log(`   Login: ${getEnvNumber('RATE_LIMIT_LOGIN_MAX', 5)} requests per ${getEnvNumber('RATE_LIMIT_LOGIN_WINDOW_MS', 15 * 60 * 1000) / 60000} minutes`);
console.log(`   Signup: ${getEnvNumber('RATE_LIMIT_SIGNUP_MAX', 3)} requests per ${getEnvNumber('RATE_LIMIT_SIGNUP_WINDOW_MS', 60 * 60 * 1000) / 60000} minutes`);
console.log(`   Upload: ${getEnvNumber('RATE_LIMIT_UPLOAD_MAX', 50)} requests per ${getEnvNumber('RATE_LIMIT_UPLOAD_WINDOW_MS', 60 * 60 * 1000) / 60000} minutes`);
console.log(`   General API: ${getEnvNumber('RATE_LIMIT_GENERAL_MAX', 1000)} requests per ${getEnvNumber('RATE_LIMIT_GENERAL_WINDOW_MS', 15 * 60 * 1000) / 60000} minutes`);
