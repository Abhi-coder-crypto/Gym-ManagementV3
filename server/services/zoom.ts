import axios from 'axios';

interface ZoomMeetingResponse {
  id: string;
  join_url: string;
  start_url: string;
  host_id: string;
  password?: string;
  topic: string;
  start_time: string;
  duration: number;
}

interface CreateMeetingParams {
  topic: string;
  start_time: string;
  duration: number;
  agenda?: string;
  password?: string;
}

export class ZoomService {
  private accountId: string;
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.accountId = process.env.ZOOM_ACCOUNT_ID || '';
    this.clientId = process.env.ZOOM_CLIENT_ID || '';
    this.clientSecret = process.env.ZOOM_ACCOUNT_SECRET || '';
    
    if (this.isConfigured()) {
      console.log('✅ Zoom service configured');
    } else {
      console.warn('⚠️  Zoom service not configured - missing credentials');
    }
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    if (!this.accountId || !this.clientId || !this.clientSecret) {
      throw new Error('Zoom API credentials not configured. Please set ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, and ZOOM_ACCOUNT_SECRET environment variables.');
    }

    try {
      console.log('🔐 Attempting Zoom OAuth with Account ID:', this.accountId.substring(0, 5) + '...');
      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await axios.post(
        `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${this.accountId}`,
        null,
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000;
      
      if (!this.accessToken) {
        throw new Error('No access token received from Zoom');
      }
      
      console.log('✅ Zoom OAuth successful');
      return this.accessToken;
    } catch (error: any) {
      console.error('❌ Zoom OAuth failed');
      console.error('Account ID:', this.accountId);
      console.error('Client ID:', this.clientId);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', JSON.stringify(error.response?.data, null, 2));
      console.error('Full error:', error.message);
      
      if (error.response?.data?.error === 'invalid_client') {
        throw new Error('Invalid Zoom credentials. Please verify your ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, and ZOOM_ACCOUNT_SECRET are correct and your Zoom app is activated.');
      }
      
      throw new Error('Failed to authenticate with Zoom API: ' + (error.response?.data?.error_description || error.message));
    }
  }

  async createMeeting(params: CreateMeetingParams): Promise<ZoomMeetingResponse> {
    try {
      const token = await this.getAccessToken();

      const response = await axios.post(
        'https://api.zoom.us/v2/users/me/meetings',
        {
          topic: params.topic,
          type: 2,
          start_time: params.start_time,
          duration: params.duration,
          timezone: 'UTC',
          agenda: params.agenda || '',
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: false,
            mute_upon_entry: false,
            waiting_room: true,
            audio: 'both',
            auto_recording: 'cloud',
            approval_type: 0,
          },
          ...(params.password ? { password: params.password } : {})
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Zoom create meeting error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create Zoom meeting');
    }
  }

  async updateMeeting(meetingId: string, params: Partial<CreateMeetingParams>): Promise<void> {
    try {
      const token = await this.getAccessToken();

      await axios.patch(
        `https://api.zoom.us/v2/meetings/${meetingId}`,
        {
          ...(params.topic ? { topic: params.topic } : {}),
          ...(params.start_time ? { start_time: params.start_time } : {}),
          ...(params.duration ? { duration: params.duration } : {}),
          ...(params.agenda ? { agenda: params.agenda } : {}),
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error: any) {
      console.error('Zoom update meeting error:', error.response?.data || error.message);
      throw new Error('Failed to update Zoom meeting');
    }
  }

  async deleteMeeting(meetingId: string): Promise<void> {
    try {
      const token = await this.getAccessToken();

      await axios.delete(
        `https://api.zoom.us/v2/meetings/${meetingId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
    } catch (error: any) {
      console.error('Zoom delete meeting error:', error.response?.data || error.message);
      throw new Error('Failed to delete Zoom meeting');
    }
  }

  async getMeetingRecordings(meetingId: string): Promise<any> {
    try {
      const token = await this.getAccessToken();

      const response = await axios.get(
        `https://api.zoom.us/v2/meetings/${meetingId}/recordings`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Zoom get recordings error:', error.response?.data || error.message);
      throw new Error('Failed to get Zoom meeting recordings');
    }
  }

  isConfigured(): boolean {
    return !!(this.accountId && this.clientId && this.clientSecret);
  }
}

export const zoomService = new ZoomService();
