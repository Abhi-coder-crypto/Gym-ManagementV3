import dotenv from 'dotenv';
dotenv.config();

import { ZoomService } from './services/zoom';

async function testZoomIntegration() {
  console.log('🧪 Testing Zoom Integration...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('ZOOM_ACCOUNT_ID:', process.env.ZOOM_ACCOUNT_ID ? '✅ Set' : '❌ Not set');
  console.log('ZOOM_CLIENT_ID:', process.env.ZOOM_CLIENT_ID ? '✅ Set' : '❌ Not set');
  console.log('ZOOM_ACCOUNT_SECRET:', process.env.ZOOM_ACCOUNT_SECRET ? '✅ Set' : '❌ Not set');
  console.log('');

  const zoomService = new ZoomService();

  if (!zoomService.isConfigured()) {
    console.log('❌ Zoom service is not configured. Please check your credentials.');
    process.exit(1);
  }

  try {
    console.log('🔄 Testing Zoom API connection...\n');

    // Create a test meeting
    const testMeeting = await zoomService.createMeeting({
      topic: 'Test Meeting - FitPro',
      start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      duration: 60,
      agenda: 'This is a test meeting to verify Zoom integration',
    });

    console.log('✅ SUCCESS! Zoom meeting created successfully!\n');
    console.log('📋 Meeting Details:');
    console.log('Meeting ID:', testMeeting.id);
    console.log('Topic:', testMeeting.topic);
    console.log('Join URL:', testMeeting.join_url);
    console.log('Start URL:', testMeeting.start_url);
    console.log('Meeting Password:', testMeeting.password);
    console.log('\n✅ Your Zoom integration is working perfectly!');

    // Clean up - delete the test meeting
    console.log('\n🧹 Cleaning up test meeting...');
    await zoomService.deleteMeeting(String(testMeeting.id));
    console.log('✅ Test meeting deleted successfully!');

  } catch (error: any) {
    console.error('❌ ERROR: Zoom API test failed\n');
    console.error('Error message:', error.message);
    
    if (error.response?.data) {
      console.error('\nZoom API Response:');
      console.error(JSON.stringify(error.response.data, null, 2));
    }

    if (error.message.includes('Invalid Zoom credentials')) {
      console.log('\n💡 Possible Solutions:');
      console.log('1. Verify your Zoom App credentials in the Zoom Marketplace');
      console.log('2. Make sure your Zoom App is activated');
      console.log('3. Check that you have the correct scopes enabled');
      console.log('4. Ensure you\'re using Server-to-Server OAuth app type');
    }

    process.exit(1);
  }
}

testZoomIntegration();
