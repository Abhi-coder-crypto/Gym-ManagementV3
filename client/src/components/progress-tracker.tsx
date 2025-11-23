import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingDown, TrendingUp, Target } from "lucide-react";

interface ProgressTrackerProps {
  weeklyStats?: Array<{ day: string; completed: boolean }>;
  goals?: Array<{ name: string; current: number; target: number; unit: string; icon: any }>;
}

export function ProgressTracker({ weeklyStats = [], goals = [] }: ProgressTrackerProps) {
  // Default weekly stats if not provided
  const defaultWeeklyStats = [
    { day: "Mon", completed: false },
    { day: "Tue", completed: false },
    { day: "Wed", completed: false },
    { day: "Thu", completed: false },
    { day: "Fri", completed: false },
    { day: "Sat", completed: false },
    { day: "Sun", completed: false },
  ];

  const defaultGoals = [
    { name: "Weight Goal", current: 0, target: 0, unit: "lbs", icon: TrendingDown },
    { name: "Weekly Workouts", current: 0, target: 5, unit: "sessions", icon: Target },
  ];

  const displayStats = weeklyStats.length > 0 ? weeklyStats : defaultWeeklyStats;
  const displayGoals = goals.length > 0 ? goals : defaultGoals;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display">Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm font-medium mb-3">This Week's Workouts</p>
          <div className="flex gap-2">
            {displayStats.map((day, index) => (
              <div key={index} className="flex-1 text-center">
                <div
                  className={`h-12 rounded-md flex items-center justify-center font-semibold text-sm ${
                    day.completed
                      ? "bg-chart-3 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {day.day}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {displayGoals.map((goal, index) => {
            const Icon = goal.icon;
            const progress = (goal.current / goal.target) * 100;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-chart-1" />
                    <span className="text-sm font-medium">{goal.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {goal.current} / {goal.target} {goal.unit}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-chart-1 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <Button variant="outline" className="w-full" data-testid="button-update-goals">
          Update Goals
        </Button>
      </CardContent>
    </Card>
  );
}
