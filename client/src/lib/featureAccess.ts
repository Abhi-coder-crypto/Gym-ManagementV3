export function hasFeature(packageName: string | null | undefined, feature: string): boolean {
  const PACKAGE_FEATURES: Record<string, string[]> = {
    'Fit Basics': ['workouts', 'diet', 'recorded_videos'],
    'Fit Plus': ['recorded_videos', 'personalized_diet', 'weekly_checkins'],
    'Pro Transformation': ['recorded_videos', 'personalized_diet', 'weekly_checkins', 'one_on_one_calls', 'habit_coaching'],
    'Elite Athlete': ['recorded_videos', 'personalized_diet', 'weekly_checkins', 'one_on_one_calls', 'habit_coaching', 'performance_tracking', 'priority_support'],
  };
  if (!packageName) return false;
  return PACKAGE_FEATURES[packageName]?.includes(feature) ?? false;
}

export function getFeatures(packageName: string | null | undefined): string[] {
  const PACKAGE_FEATURES: Record<string, string[]> = {
    'Fit Basics': ['workouts', 'diet', 'recorded_videos'],
    'Fit Plus': ['recorded_videos', 'personalized_diet', 'weekly_checkins'],
    'Pro Transformation': ['recorded_videos', 'personalized_diet', 'weekly_checkins', 'one_on_one_calls', 'habit_coaching'],
    'Elite Athlete': ['recorded_videos', 'personalized_diet', 'weekly_checkins', 'one_on_one_calls', 'habit_coaching', 'performance_tracking', 'priority_support'],
  };
  if (!packageName) return [];
  return PACKAGE_FEATURES[packageName] ?? [];
}

export function isSubscriptionActive(subscriptionEndDate: any): boolean {
  if (!subscriptionEndDate) return false;
  return new Date() < new Date(subscriptionEndDate);
}

export function getRemainingDays(subscriptionEndDate: any): number {
  if (!subscriptionEndDate) return 0;
  const endDate = new Date(subscriptionEndDate);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export const FEATURE_LABELS: Record<string, string> = {
  'recorded_videos': 'Recorded Videos',
  'personalized_diet': 'Personalized Diet',
  'weekly_checkins': 'Weekly Check-ins',
  'one_on_one_calls': '1-on-1 Calls',
  'habit_coaching': 'Habit Coaching',
  'performance_tracking': 'Performance Tracking',
  'priority_support': 'Priority Support',
  'workouts': 'Workout Plans',
  'diet': 'Basic Diet'
};

export const FEATURE_DESCRIPTIONS: Record<string, string> = {
  'recorded_videos': 'Access to recorded training videos',
  'personalized_diet': 'Custom meal plans tailored to your goals',
  'weekly_checkins': 'Weekly progress check-in calls',
  'one_on_one_calls': 'Weekly 1-on-1 coaching sessions',
  'habit_coaching': 'Daily habit tracking and coaching',
  'performance_tracking': 'Advanced performance metrics and analytics',
  'priority_support': 'Priority customer support (24-48 hour response)',
  'workouts': 'Pre-designed workout programs',
  'diet': 'Basic diet templates and guidelines'
};
