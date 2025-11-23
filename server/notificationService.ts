/**
 * Notification Service for subscription reminders and alerts
 */
import { IClient } from './models';

export class NotificationService {
  /**
   * Check if client subscription is expiring soon (7 days or less)
   */
  static isExpiringWithin7Days(client: IClient): boolean {
    if (!client.subscriptionEndDate) return false;
    const endDate = new Date(client.subscriptionEndDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
  }

  /**
   * Check if subscription has expired
   */
  static isExpired(client: IClient): boolean {
    if (!client.subscriptionEndDate) return false;
    return new Date() > new Date(client.subscriptionEndDate);
  }

  /**
   * Get subscription status for client
   */
  static getSubscriptionStatus(client: IClient): 'active' | 'expiring_soon' | 'expired' {
    if (this.isExpired(client)) return 'expired';
    if (this.isExpiringWithin7Days(client)) return 'expiring_soon';
    return 'active';
  }

  /**
   * Generate renewal reminder notification
   */
  static generateRenewalReminder(client: IClient): { title: string; message: string; type: 'warning' } {
    const daysLeft = Math.ceil(
      (new Date(client.subscriptionEndDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return {
      title: 'Subscription Expiring Soon',
      message: `Your ${client.packageId} subscription expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}. Renew now to maintain access.`,
      type: 'warning',
    };
  }

  /**
   * Generate expiration notification
   */
  static generateExpirationNotification(client: IClient): { title: string; message: string; type: 'error' } {
    return {
      title: 'Subscription Expired',
      message: `Your ${client.packageId} subscription has expired. Renew to regain access to all features.`,
      type: 'error',
    };
  }

  /**
   * Generate upgrade recommendation based on usage
   */
  static generateUpgradeRecommendation(currentPackage: string): { title: string; message: string; recommendedPackage: string } | null {
    const upgradePaths: Record<string, { package: string; message: string }> = {
      'Fit Basics': {
        package: 'Fit Plus',
        message: 'You\'re using many sessions. Fit Plus includes personalized diet and weekly check-ins.'
      },
      'Fit Plus': {
        package: 'Pro Transformation',
        message: 'Unlock 1-on-1 calls and habit coaching to accelerate your progress.'
      },
      'Pro Transformation': {
        package: 'Elite Athlete',
        message: 'Get performance tracking and priority support to maximize your results.'
      }
    };

    const recommendation = upgradePaths[currentPackage];
    if (!recommendation) return null;

    return {
      title: `Upgrade to ${recommendation.package}`,
      message: recommendation.message,
      recommendedPackage: recommendation.package
    };
  }
}

export default NotificationService;
