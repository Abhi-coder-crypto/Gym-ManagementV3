import { storage } from '../storage';

/**
 * GDPR Compliance: Export all user data
 * Generates a comprehensive JSON export of all user's personal data
 */
export async function exportUserData(userId: string, clientId?: string) {
  const userData: any = {
    exportDate: new Date().toISOString(),
    userId: userId,
  };

  try {
    // Get user account information
    const user = await storage.getUserById(userId);
    if (user) {
      const { password, ...userWithoutPassword } = user.toObject();
      userData.account = userWithoutPassword;
    }

    // If user is a client, export all client-related data
    if (clientId) {
      // Client profile
      const client = await storage.getClient(clientId);
      if (client) {
        userData.profile = client.toObject();
      }

      // Body metrics history
      const bodyMetrics = await storage.getClientBodyMetrics(clientId);
      userData.bodyMetrics = bodyMetrics.map(m => m.toObject());

      // Workout plans
      const workoutPlans = await storage.getClientWorkoutPlans(clientId);
      userData.workoutPlans = workoutPlans.map(p => p.toObject());

      // Diet plans
      const dietPlans = await storage.getClientDietPlans(clientId);
      userData.dietPlans = dietPlans.map(p => p.toObject());

      // Workout sessions
      const workoutSessions = await storage.getClientWorkoutSessions(clientId);
      userData.workoutSessions = workoutSessions.map(s => s.toObject());

      // Live sessions
      const liveSessions = await storage.getClientSessions(clientId);
      userData.liveSessions = liveSessions.map(s => s.toObject());

      // Video progress
      const continueWatching = await storage.getContinueWatching(clientId);
      userData.videoProgress = continueWatching;

      // Bookmarked videos
      const bookmarks = await storage.getVideoBookmarks(clientId);
      userData.videoBookmarks = bookmarks;

      // Progress photos
      const progressPhotos = await storage.getProgressPhotos(clientId);
      userData.progressPhotos = progressPhotos.map(p => p.toObject());

      // Goals
      const goals = await storage.getClientGoals(clientId);
      userData.goals = goals.map(g => g.toObject());

      // Achievements
      const achievements = await storage.getClientAchievements(clientId);
      userData.achievements = achievements.map(a => a.toObject());

      // Payment history
      const paymentHistory = await storage.getClientPaymentHistory(clientId);
      userData.paymentHistory = paymentHistory.map(p => p.toObject());

      // Weight history
      const weightHistory = await storage.getClientWeightHistory(clientId);
      userData.weightHistory = weightHistory;

      // Body measurements history
      const measurementsHistory = await storage.getClientBodyMeasurementsHistory(clientId);
      userData.bodyMeasurementsHistory = measurementsHistory;

      // Personal records
      const personalRecords = await storage.getClientPersonalRecords(clientId);
      userData.personalRecords = personalRecords;
    }

    return userData;
  } catch (error) {
    console.error('Error exporting user data:', error);
    throw new Error('Failed to export user data');
  }
}

/**
 * Generate a CSV export of basic user information
 */
export function generateUserDataCSV(data: any): string {
  const lines: string[] = [];
  
  // Add header
  lines.push('GDPR Data Export');
  lines.push(`Export Date: ${data.exportDate}`);
  lines.push(`User ID: ${data.userId}`);
  lines.push('');
  
  // Account information
  if (data.account) {
    lines.push('Account Information:');
    lines.push(`Email: ${data.account.email}`);
    lines.push(`Name: ${data.account.name}`);
    lines.push(`Role: ${data.account.role}`);
    lines.push(`Created: ${data.account.createdAt}`);
    lines.push('');
  }
  
  // Profile information
  if (data.profile) {
    lines.push('Profile Information:');
    Object.entries(data.profile).forEach(([key, value]) => {
      if (key !== '_id' && key !== '__v' && value !== null && value !== undefined) {
        lines.push(`${key}: ${JSON.stringify(value)}`);
      }
    });
    lines.push('');
  }
  
  return lines.join('\n');
}
