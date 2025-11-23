import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({ override: true });

const BASE_URL = 'http://localhost:5000';

async function testRateLimiting() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║          Rate Limiting / API Throttling Test             ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  console.log(`🔗 Testing against: ${BASE_URL}`);
  console.log('📋 Test: Login endpoint rate limiting (IP-based)\n');

  const testEmail = 'test-rate-limit@example.com';
  const testPassword = 'TestPassword123!';

  console.log(`📝 Test Credentials:`);
  console.log(`   Email: ${testEmail}`);
  console.log(`   Password: ${testPassword}`);
  console.log(`   Rate Limit: 5 requests per 15 minutes\n`);

  console.log('═══════════════════════════════════════════════════════════');
  console.log('Sending 7 login requests to trigger rate limit...');
  console.log('═══════════════════════════════════════════════════════════\n');

  const results: Array<{ attempt: number; status: number; message: string; rateLimitRemaining?: number }> = [];

  for (let i = 1; i <= 7; i++) {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        {
          email: testEmail,
          password: testPassword
        },
        {
          validateStatus: () => true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const remaining = response.headers['ratelimit-remaining'];
      const limit = response.headers['ratelimit-limit'];
      const resetTime = response.headers['ratelimit-reset'];

      if (response.status === 429) {
        console.log(`❌ Attempt ${i}: RATE LIMITED (429)`);
        console.log(`   Message: ${response.data.error}`);
        if (response.data.retryAfter) {
          console.log(`   Retry After: ${response.data.retryAfter} seconds`);
        }
        console.log('');

        results.push({
          attempt: i,
          status: 429,
          message: 'Rate limit exceeded'
        });
      } else {
        console.log(`✓ Attempt ${i}: Request accepted (${response.status})`);
        console.log(`   Rate Limit: ${remaining}/${limit} requests remaining`);
        if (resetTime) {
          const resetDate = new Date(parseInt(resetTime) * 1000);
          console.log(`   Resets at: ${resetDate.toLocaleTimeString()}`);
        }
        console.log('');

        results.push({
          attempt: i,
          status: response.status,
          message: response.data.message || 'Success',
          rateLimitRemaining: parseInt(remaining || '0')
        });
      }

      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error: any) {
      console.log(`❌ Attempt ${i}: ERROR`);
      console.log(`   ${error.message}\n`);
      
      results.push({
        attempt: i,
        status: 0,
        message: error.message
      });
    }
  }

  console.log('═══════════════════════════════════════════════════════════');
  console.log('Test Results Summary');
  console.log('═══════════════════════════════════════════════════════════\n');

  const accepted = results.filter(r => r.status !== 429 && r.status !== 0);
  const rateLimited = results.filter(r => r.status === 429);
  const errors = results.filter(r => r.status === 0);

  console.log(`✅ Accepted Requests: ${accepted.length}`);
  console.log(`🚫 Rate Limited: ${rateLimited.length}`);
  console.log(`❌ Errors: ${errors.length}\n`);

  if (rateLimited.length > 0) {
    console.log('✅ RATE LIMITING IS WORKING!');
    console.log(`   Requests 1-${accepted.length}: Accepted`);
    console.log(`   Requests ${accepted.length + 1}-7: Rate limited (429)\n`);
  } else {
    console.log('⚠️  WARNING: No rate limiting detected!');
    console.log('   All requests were accepted. Rate limit may not be configured correctly.\n');
  }

  console.log('═══════════════════════════════════════════════════════════');
  console.log('Additional Tests');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('📝 Testing signup rate limiting...');
  try {
    const signupResponse = await axios.post(
      `${BASE_URL}/api/auth/signup`,
      {
        email: `test-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        name: 'Test User'
      },
      {
        validateStatus: () => true
      }
    );

    const remaining = signupResponse.headers['ratelimit-remaining'];
    const limit = signupResponse.headers['ratelimit-limit'];

    console.log(`   Status: ${signupResponse.status}`);
    console.log(`   Rate Limit: ${remaining}/${limit} requests remaining\n`);
  } catch (error: any) {
    console.log(`   Error: ${error.message}\n`);
  }

  console.log('═══════════════════════════════════════════════════════════');
  console.log('Rate Limiting Configuration');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('📊 Current Limits (from environment):');
  console.log(`   Login:          ${process.env.RATE_LIMIT_LOGIN_MAX || 5} requests / ${(parseInt(process.env.RATE_LIMIT_LOGIN_WINDOW_MS || '900000') / 60000).toFixed(0)} min`);
  console.log(`   Signup:         ${process.env.RATE_LIMIT_SIGNUP_MAX || 3} requests / ${(parseInt(process.env.RATE_LIMIT_SIGNUP_WINDOW_MS || '3600000') / 60000).toFixed(0)} min`);
  console.log(`   Password Reset: ${process.env.RATE_LIMIT_PASSWORD_RESET_MAX || 3} requests / ${(parseInt(process.env.RATE_LIMIT_PASSWORD_RESET_WINDOW_MS || '3600000') / 60000).toFixed(0)} min`);
  console.log(`   Upload:         ${process.env.RATE_LIMIT_UPLOAD_MAX || 50} requests / ${(parseInt(process.env.RATE_LIMIT_UPLOAD_WINDOW_MS || '3600000') / 60000).toFixed(0)} min`);
  console.log(`   General API:    ${process.env.RATE_LIMIT_GENERAL_MAX || 1000} requests / ${(parseInt(process.env.RATE_LIMIT_GENERAL_WINDOW_MS || '900000') / 60000).toFixed(0)} min\n`);

  console.log('🔑 Environment Variables:');
  console.log('   RATE_LIMIT_LOGIN_MAX');
  console.log('   RATE_LIMIT_LOGIN_WINDOW_MS');
  console.log('   RATE_LIMIT_SIGNUP_MAX');
  console.log('   RATE_LIMIT_SIGNUP_WINDOW_MS');
  console.log('   RATE_LIMIT_PASSWORD_RESET_MAX');
  console.log('   RATE_LIMIT_PASSWORD_RESET_WINDOW_MS');
  console.log('   RATE_LIMIT_UPLOAD_MAX');
  console.log('   RATE_LIMIT_UPLOAD_WINDOW_MS');
  console.log('   RATE_LIMIT_GENERAL_MAX');
  console.log('   RATE_LIMIT_GENERAL_WINDOW_MS\n');

  console.log('✅ Rate Limiting Test Complete!\n');
}

testRateLimiting().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
