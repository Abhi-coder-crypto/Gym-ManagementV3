import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TrendingUp, Target, CheckCircle2, XCircle } from "lucide-react";

interface ProgressSidebarProps {
  weeklyWorkouts: {
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
  };
  weightCurrent: number;
  weightTarget: number;
  weeklyCompletion: number;
  onUpdateGoals?: () => void;
}

export function ProgressSidebar({
  weeklyWorkouts,
  weightCurrent,
  weightTarget,
  weeklyCompletion,
  onUpdateGoals,
}: ProgressSidebarProps) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const workoutValues = Object.values(weeklyWorkouts);
  const completedDays = workoutValues.filter(Boolean).length;
  const missedDays = 5 - completedDays;
  const weightProgress = weightTarget > 0 ? (weightCurrent / weightTarget) * 100 : 0;
  const sessionsProgress = (completedDays / 5) * 100;

  return (
    <Card className="hover-elevate border-0 shadow-lg bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
        <CardTitle className="text-2xl font-bold text-foreground">Your Progress</CardTitle>
        <p className="text-xs text-muted-foreground mt-1">Track your weekly performance and goals</p>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* This Week's Workouts - Simple */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-sm">Weekly Workouts</h3>
            </div>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {completedDays} / 5 sessions
            </span>
          </div>
          
          {/* Workout Days Grid - Circles (Mon-Sat only) */}
          <div className="flex justify-between gap-2">
            {days.slice(0, 6).map((day, index) => (
              <div key={day} className="flex flex-col items-center">
                <button
                  className={`w-12 h-12 rounded-full text-xs font-bold transition-all duration-200 flex items-center justify-center ${
                    index < 3
                      ? "bg-green-500 text-white shadow-md hover:shadow-lg"
                      : index < 5
                      ? "bg-red-500 text-white shadow-md hover:shadow-lg"
                      : "bg-white border-2 border-black text-black"
                  }`}
                  data-testid={`workout-day-${day.toLowerCase()}`}
                >
                  {day}
                </button>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="pt-2">
            <Progress
              value={sessionsProgress}
              className="h-2.5"
              data-testid="progress-workouts"
            />
          </div>
        </div>

        {/* Weight Goal - Enhanced */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-sm">Weight Goal</h3>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-foreground">
                {weightCurrent} / {weightTarget} lbs
              </p>
              <p className="text-xs text-muted-foreground">
                {weightTarget > 0 ? weightTarget - weightCurrent : 0} lbs to go
              </p>
            </div>
          </div>

          {/* Weight Progress Bar */}
          <div className="space-y-2">
            <Progress
              value={Math.min(weightProgress, 100)}
              className="h-2.5"
              data-testid="progress-weight"
            />
            <p className="text-xs text-muted-foreground text-right">{Math.round(Math.min(weightProgress, 100))}% progress</p>
          </div>
        </div>

        {/* Update Goals Button */}
        <Button
          variant="default"
          size="sm"
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          onClick={onUpdateGoals}
          data-testid="button-update-goals"
        >
          Update Goals
        </Button>
      </CardContent>
    </Card>
  );
}
