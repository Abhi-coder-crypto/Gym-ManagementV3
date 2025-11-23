import { LiveSession, SystemSettings } from '../models';
import { Notification } from '../models/notification';
import { storage } from '../storage';
import { emailService } from './email';

const sentReminderCache = new Set<string>();

export async function checkAndSendSessionReminders() {
  try {
    const settings = await SystemSettings.findOne();
    
    if (!settings?.notificationSettings?.sessionReminders) {
      return;
    }
    
    const reminderHours = settings.notificationSettings.reminderHoursBefore || 24;
    const reminderTime = new Date(Date.now() + reminderHours * 60 * 60 * 1000);
    const nowPlus1Hour = new Date(Date.now() + (reminderHours + 1) * 60 * 60 * 1000);
    
    const upcomingSessions = await LiveSession.find({
      status: 'upcoming',
      scheduledAt: {
        $gte: reminderTime,
        $lte: nowPlus1Hour,
      },
    }).populate('trainerId', 'name');
    
    console.log(`📧 Checking session reminders: found ${upcomingSessions.length} sessions in reminder window`);
    
    for (const session of upcomingSessions) {
      try {
        const sessionKey = `${session._id.toString()}-${session.scheduledAt.getTime()}`;
        if (sentReminderCache.has(sessionKey)) {
          continue;
        }
        
        const alreadySent = await Notification.findOne({
          type: 'session_reminder',
          title: `Session Reminder: ${session.title}`,
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        });
        
        if (alreadySent) {
          sentReminderCache.add(sessionKey);
          continue;
        }
        
        const sessionClients = await storage.getSessionClients(session._id.toString());
        
        for (const sessionClient of sessionClients) {
          const client = await storage.getClient(sessionClient.clientId.toString());
          if (!client || !client.email) continue;
          
          const user = await storage.getUserByEmail(client.email);
          
          await emailService.sendSessionReminderEmail(
            client.email,
            client.name,
            session.title,
            session.scheduledAt,
            user?._id?.toString()
          );
          
          console.log(`📧 Sent session reminder to ${client.email} for "${session.title}"`);
        }
        
        sentReminderCache.add(sessionKey);
      } catch (error) {
        console.error(`Error sending reminders for session ${session._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in session reminder scheduler:', error);
  }
}

export function startSessionReminderScheduler() {
  checkAndSendSessionReminders();
  
  const intervalMinutes = 30;
  setInterval(() => {
    checkAndSendSessionReminders();
  }, intervalMinutes * 60 * 1000);
  
  console.log(`📧 Session reminder scheduler started (checking every ${intervalMinutes} minutes)`);
}
