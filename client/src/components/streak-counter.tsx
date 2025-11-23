import { Flame, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StreakCounterProps {
  current: number;
  max: number;
  daysRemaining?: number;
}

export function StreakCounter({ current, max, daysRemaining }: StreakCounterProps) {
  return (
    <Card className="hover-elevate bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-900">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-500" />
          Workout Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-2">
          <div className="text-4xl font-bold text-orange-600">{current}</div>
          <span className="text-xs text-muted-foreground">days in a row</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-orange-200 dark:border-orange-900">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Personal Best</p>
            <p className="text-lg font-bold text-orange-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {max}
            </p>
          </div>
          {daysRemaining !== undefined && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Keep It Up</p>
              <p className="text-lg font-bold text-blue-600">{daysRemaining > 0 ? daysRemaining : 0} days</p>
            </div>
          )}
        </div>

        {current > 0 && current % 7 === 0 && (
          <div className="mt-2 p-2 bg-amber-100 dark:bg-amber-900/30 rounded-md border border-amber-200 dark:border-amber-800">
            <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
              🎉 Week {Math.floor(current / 7)} completed! Keep pushing!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
