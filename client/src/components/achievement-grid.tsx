import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Flame, Target, Star, Bookmark, Zap } from "lucide-react";
import { useLocation } from "wouter";

interface Achievement {
  id: string;
  title: string;
  icon: any;
  unlocked: boolean;
}

interface AchievementGridProps {
  achievements?: Achievement[];
  unlockedCount?: number;
  totalCount?: number;
}

const ACHIEVEMENT_COLORS = [
  { icon: "text-blue-600 dark:text-blue-500" },
  { icon: "text-orange-500 dark:text-orange-400" },
  { icon: "text-green-600 dark:text-green-500" },
  { icon: "text-gray-400 dark:text-gray-500" },
  { icon: "text-gray-400 dark:text-gray-500" },
  { icon: "text-gray-400 dark:text-gray-500" },
];

export function AchievementGrid({
  achievements,
  unlockedCount = 3,
  totalCount = 6,
}: AchievementGridProps) {
  const [, setLocation] = useLocation();

  const defaultAchievements: Achievement[] = [
    {
      id: "first-workout",
      title: "First Workout",
      icon: Trophy,
      unlocked: unlockedCount >= 1,
    },
    {
      id: "7-day-streak",
      title: "7 Day Streak",
      icon: Flame,
      unlocked: unlockedCount >= 2,
    },
    {
      id: "10-workouts",
      title: "10 Workouts",
      icon: Target,
      unlocked: unlockedCount >= 3,
    },
    {
      id: "30-day-streak",
      title: "30 Day Streak",
      icon: Star,
      unlocked: unlockedCount >= 4,
    },
    {
      id: "50-workouts",
      title: "50 Workouts",
      icon: Bookmark,
      unlocked: unlockedCount >= 5,
    },
    {
      id: "100-workouts",
      title: "100 Workouts",
      icon: Zap,
      unlocked: unlockedCount >= 6,
    },
  ];

  return (
    <Card className="hover-elevate border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
      <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">Achievements</CardTitle>
        <span className="text-lg font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          {unlockedCount}/{totalCount}
        </span>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {defaultAchievements.map((achievement, index) => {
            const Icon = achievement.icon;
            const iconColor = ACHIEVEMENT_COLORS[index].icon;
            return (
              <div
                key={achievement.id}
                className="flex flex-col items-center gap-1 py-3 px-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-all"
                data-testid={`achievement-${achievement.id}`}
              >
                <Icon
                  strokeWidth={2}
                  className={`h-8 w-8 transition-all ${
                    achievement.unlocked ? iconColor : "text-gray-300 dark:text-gray-600"
                  }`}
                />
                <p
                  className={`text-xs font-semibold text-center leading-tight ${
                    achievement.unlocked
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {achievement.title}
                </p>
              </div>
            );
          })}
        </div>
        <Button
          variant="outline"
          className="w-full text-base font-semibold text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 h-12"
          onClick={() => setLocation("/client/progress/achievements")}
          data-testid="button-all-achievements"
        >
          View All Achievements
        </Button>
      </CardContent>
    </Card>
  );
}
