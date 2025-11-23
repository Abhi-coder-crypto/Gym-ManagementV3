import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Trophy, Dumbbell, Target, TrendingUp, Calendar, CheckCircle2, Zap } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  requirement: number;
  current: number;
  unlocked: boolean;
  category: string;
}

interface AchievementBadgesProps {
  achievements: Achievement[];
  isLoading?: boolean;
}

export function AchievementBadges({ achievements, isLoading }: AchievementBadgesProps) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <Card className="hover-elevate">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Achievements
          </CardTitle>
          <Badge variant="secondary">
            {unlockedCount}/{totalCount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {achievements.slice(0, 3).map((achievement) => (
            <div
              key={achievement.id}
              className={`p-3 rounded-lg border-2 transition-all ${
                achievement.unlocked
                  ? "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-yellow-300 dark:border-yellow-800"
                  : "bg-muted/30 border-muted-foreground/20"
              }`}
              data-testid={`achievement-${achievement.id}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    achievement.unlocked
                      ? "bg-yellow-200 dark:bg-yellow-700"
                      : "bg-muted"
                  }`}
                >
                  <achievement.icon className={`h-5 w-5 ${achievement.unlocked ? "text-yellow-700 dark:text-yellow-200" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${achievement.unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                    {achievement.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                  {!achievement.unlocked && achievement.requirement > 0 && (
                    <div className="mt-2 space-y-1">
                      <Progress
                        value={(achievement.current / achievement.requirement) * 100}
                        className="h-1.5"
                      />
                      <p className="text-xs text-muted-foreground">
                        {achievement.current} / {achievement.requirement}
                      </p>
                    </div>
                  )}
                  {achievement.unlocked && (
                    <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-200 mt-1">✓ Unlocked</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {totalCount > 3 && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground text-center">
                +{totalCount - 3} more achievements
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
