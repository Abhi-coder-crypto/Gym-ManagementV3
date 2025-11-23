# API Rate Limiting Setup Guide

## Overview

The FitPro Management System includes comprehensive API rate limiting to protect against abuse, brute force attacks, and denial of service attempts. Rate limiting is implemented using `express-rate-limit` with IP-based throttling and configurable limits.

## Features

✅ **IP-Based Rate Limiting**: Tracks requests per IP address (IPv4 and IPv6 compatible)
✅ **Configurable Limits**: All limits configurable via environment variables
✅ **In-Memory Storage**: No Redis required - uses in-memory store
✅ **Standard Headers**: Returns `RateLimit-*` headers in responses
✅ **Custom Error Messages**: User-friendly error messages with retry-after information
✅ **Endpoint-Specific Limits**: Different limits for different endpoint types

## Protected Endpoints

### 1. Login Endpoint (`/api/auth/login`)
- **Limit**: 5 requests per 15 minutes
- **Purpose**: Prevent brute force password attacks
- **Environment Variables**:
  - `RATE_LIMIT_LOGIN_MAX=5`
  - `RATE_LIMIT_LOGIN_WINDOW_MS=900000`

### 2. Signup Endpoint (`/api/auth/signup`)
- **Limit**: 3 requests per 60 minutes
- **Purpose**: Prevent spam account creation
- **Environment Variables**:
  - `RATE_LIMIT_SIGNUP_MAX=3`
  - `RATE_LIMIT_SIGNUP_WINDOW_MS=3600000`

### 3. Password Reset Endpoints (`/api/auth/forgot-password`, `/api/auth/reset-password`)
- **Limit**: 3 requests per 60 minutes
- **Purpose**: Prevent password reset abuse
- **Environment Variables**:
  - `RATE_LIMIT_PASSWORD_RESET_MAX=3`
  - `RATE_LIMIT_PASSWORD_RESET_WINDOW_MS=3600000`

### 4. File Upload Endpoint (`/api/encrypted-files/upload-encrypted-photo`)
- **Limit**: 50 requests per 60 minutes
- **Purpose**: Prevent storage abuse
- **Environment Variables**:
  - `RATE_LIMIT_UPLOAD_MAX=50`
  - `RATE_LIMIT_UPLOAD_WINDOW_MS=3600000`

### 5. Payment Webhooks (Future Implementation)
- **Limit**: 100 requests per 60 seconds
- **Purpose**: Prevent webhook spam
- **Status**: ⏳ Not yet implemented - reserved for future payment gateway integration
- **Environment Variables**:
  - `RATE_LIMIT_WEBHOOK_MAX=100`
  - `RATE_LIMIT_WEBHOOK_WINDOW_MS=60000`
- **Note**: The `paymentWebhookRateLimiter` middleware is available and ready to be applied when payment webhook endpoints are added

### 6. Authentication Endpoints (general)
- **Limit**: 10 requests per 15 minutes
- **Purpose**: Secondary protection for auth endpoints
- **Environment Variables**:
  - `RATE_LIMIT_AUTH_MAX=10`
  - `RATE_LIMIT_AUTH_WINDOW_MS=900000`

### 7. General API Endpoints
- **Limit**: 1000 requests per 15 minutes
- **Purpose**: Prevent general API abuse
- **Environment Variables**:
  - `RATE_LIMIT_GENERAL_MAX=1000`
  - `RATE_LIMIT_GENERAL_WINDOW_MS=900000`

## Configuration

### Environment Variables

Add these variables to your `.env` file (defaults shown):

```bash
# Login Rate Limit (IP-based)
RATE_LIMIT_LOGIN_MAX=5
RATE_LIMIT_LOGIN_WINDOW_MS=900000

# Signup Rate Limit (IP-based)
RATE_LIMIT_SIGNUP_MAX=3
RATE_LIMIT_SIGNUP_WINDOW_MS=3600000

# Password Reset Rate Limit (IP-based)
RATE_LIMIT_PASSWORD_RESET_MAX=3
RATE_LIMIT_PASSWORD_RESET_WINDOW_MS=3600000

# File Upload Rate Limit (IP-based)
RATE_LIMIT_UPLOAD_MAX=50
RATE_LIMIT_UPLOAD_WINDOW_MS=3600000

# Payment Webhook Rate Limit (IP-based)
RATE_LIMIT_WEBHOOK_MAX=100
RATE_LIMIT_WEBHOOK_WINDOW_MS=60000

# Auth Rate Limit (IP-based)
RATE_LIMIT_AUTH_MAX=10
RATE_LIMIT_AUTH_WINDOW_MS=900000

# General API Rate Limit (IP-based)
RATE_LIMIT_GENERAL_MAX=1000
RATE_LIMIT_GENERAL_WINDOW_MS=900000
```

### Adjusting Limits

To increase or decrease limits, modify the environment variables:

**Example: Stricter login limits**
```bash
RATE_LIMIT_LOGIN_MAX=3
RATE_LIMIT_LOGIN_WINDOW_MS=1800000  # 30 minutes
```

**Example: More generous file uploads**
```bash
RATE_LIMIT_UPLOAD_MAX=100
RATE_LIMIT_UPLOAD_WINDOW_MS=1800000  # 30 minutes
```

## Testing Rate Limiting

### Automated Test Script

Run the included test script to verify rate limiting:

```bash
npm run test:rate-limit
```

This script will:
1. Send 7 login requests to trigger the rate limit
2. Show which requests were accepted (1-5) and which were rate limited (6-7)
3. Display rate limit headers and retry-after information
4. Test signup rate limiting
5. Show current configuration

### Manual Testing with curl

**Test login rate limiting:**
```bash
# Send multiple requests to trigger rate limit
for i in {1..7}; do
  echo "Request $i:"
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test123"}' \
    -i | grep -E "HTTP/|RateLimit-|error"
  echo ""
  sleep 1
done
```

Expected output:
- Requests 1-5: HTTP 200 or 401 (accepted)
- Requests 6-7: HTTP 429 (rate limited)

## Response Format

### Successful Request (Within Limit)

```json
HTTP/1.1 200 OK
RateLimit-Limit: 5
RateLimit-Remaining: 3
RateLimit-Reset: 1234567890

{
  "message": "Login successful"
}
```

### Rate Limited Request

```json
HTTP/1.1 429 Too Many Requests
RateLimit-Limit: 5
RateLimit-Remaining: 0
RateLimit-Reset: 1234567890

{
  "error": "Too many login attempts from this IP, please try again after 15 minutes",
  "retryAfter": 900
}
```

## Rate Limit Headers

The following standard headers are included in all responses:

- `RateLimit-Limit`: Maximum number of requests allowed in the window
- `RateLimit-Remaining`: Number of requests remaining in current window
- `RateLimit-Reset`: Unix timestamp when the rate limit resets

## Server Logs

When a rate limit is exceeded, the server logs the event:

```
🚫 Rate limit exceeded for login from IP: 192.168.1.100
```

This helps with monitoring and debugging rate limiting issues.

## Implementation Details

### Middleware Location

Rate limiting middleware is located in:
```
server/middleware/rate-limit.ts
```

### Applied Endpoints

Rate limiters are applied in:
```
server/routes.ts
server/routes/encrypted-files.ts
```

### Code Example

```typescript
import { loginRateLimiter } from './middleware/rate-limit';

app.post("/api/auth/login", loginRateLimiter, async (req, res) => {
  // Login handler
});
```

## Production Considerations

### Proxy Configuration

If running behind a proxy (Nginx, Cloudflare, etc.), ensure Express is configured to trust the proxy:

```typescript
app.set('trust proxy', 1); // Trust first proxy
```

This ensures `req.ip` contains the real client IP, not the proxy IP.

### Scaling to Multiple Servers

The current implementation uses in-memory storage, which works for single-server deployments. For multi-server deployments, consider using a shared store:

1. **Redis Store** (recommended for production):
```bash
npm install rate-limit-redis redis
```

2. Update middleware:
```typescript
import { createClient } from 'redis';
import RedisStore from 'rate-limit-redis';

const client = createClient({
  url: process.env.REDIS_URL
});

export const loginRateLimiter = rateLimit({
  store: new RedisStore({
    client,
    prefix: 'rl:login:'
  }),
  // ... other options
});
```

### CloudFlare/CDN Integration

If using CloudFlare or a CDN, rate limiting is often available at the edge. Consider:
- Using CloudFlare's built-in rate limiting for additional protection
- Implementing application-level rate limiting as a secondary defense layer

## Monitoring and Analytics

### Log Analysis

Monitor rate limiting events by searching logs:

```bash
grep "Rate limit exceeded" logs/server.log
```

### Metrics to Track

1. **Rate Limit Hit Rate**: How often users hit the limit
2. **Top IPs**: Which IPs are hitting limits most often
3. **Endpoint Distribution**: Which endpoints are rate limited most

### Alerting

Consider setting up alerts for:
- Unusually high rate limit hits (potential attack)
- Specific IPs repeatedly hitting limits (ban candidates)

## Security Best Practices

1. **Don't Disable Rate Limiting**: Even in development, keep it enabled for testing
2. **Use HTTPS**: Rate limiting alone doesn't protect credentials in transit
3. **Monitor Logs**: Regularly review rate limit logs for suspicious activity
4. **Adjust Limits**: Fine-tune limits based on actual usage patterns
5. **Combine with Other Security**: Use rate limiting alongside:
   - Strong password policies
   - CAPTCHA for public endpoints
   - Account lockout after multiple failures
   - IP blocking for repeated offenders

## Troubleshooting

### Issue: Rate limiting not working

**Solution:**
1. Check environment variables are loaded
2. Verify middleware is applied to routes
3. Check Express trust proxy settings
4. Look for errors in console logs

### Issue: Users hitting limits too quickly

**Solution:**
1. Increase `RATE_LIMIT_*_MAX` value
2. Increase `RATE_LIMIT_*_WINDOW_MS` value
3. Review if legitimate traffic is being blocked

### Issue: IPv6 warnings in logs

**Solution:**
Don't use custom `keyGenerator` functions that access `req.ip` directly. The middleware handles IPv6 automatically.

## Additional Resources

- [express-rate-limit Documentation](https://github.com/express-rate-limit/express-rate-limit)
- [OWASP API Security Project](https://owasp.org/www-project-api-security/)
- [RFC 6585 - Additional HTTP Status Codes](https://tools.ietf.org/html/rfc6585)

## Support

For issues or questions about rate limiting:
1. Check server logs for errors
2. Review environment variable configuration
3. Test with the included test script
4. Verify proxy configuration if behind load balancer
