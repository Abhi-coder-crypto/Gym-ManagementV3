import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Droplet, Plus, Minus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface WaterIntakeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
}

export function WaterCalculator({ open, onOpenChange, clientId }: WaterIntakeProps) {
  const [customAmount, setCustomAmount] = useState("250");
  const queryClient = useQueryClient();

  const { data: waterData } = useQuery({
    queryKey: ["/api/water-intake/today", clientId],
    enabled: !!clientId && open,
  });

  const dailyGoal = 2000; // 2 liters default
  const todayIntake = waterData?.totalToday || 0;
  const progress = Math.min(100, (todayIntake / dailyGoal) * 100);

  const logMutation = useMutation({
    mutationFn: async (amount: number) => {
      return apiRequest("POST", "/api/water-intake", { amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/water-intake/today", clientId] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard", clientId] });
    },
  });

  const quickLog = (ml: number) => {
    logMutation.mutate(ml);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-blue-500" />
            Water Intake Tracker
          </DialogTitle>
          <DialogDescription>Stay hydrated! Log your water intake throughout the day</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Daily Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Today's Goal</span>
              <span className="text-sm font-bold text-blue-600">{todayIntake} / {dailyGoal} ml</span>
            </div>
            <Progress value={progress} className="h-3" data-testid="progress-water" />
            {progress >= 100 && (
              <p className="text-xs text-green-600 font-medium">Goal reached! Congratulations!</p>
            )}
          </div>

          {/* Quick Log Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => quickLog(250)}
              disabled={logMutation.isPending}
              className="flex flex-col h-auto py-3"
              data-testid="button-log-250ml"
            >
              <Droplet className="h-4 w-4 mb-1" />
              <span className="text-xs">250 ml</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => quickLog(500)}
              disabled={logMutation.isPending}
              className="flex flex-col h-auto py-3"
              data-testid="button-log-500ml"
            >
              <Droplet className="h-4 w-4 mb-1" />
              <span className="text-xs">500 ml</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => quickLog(750)}
              disabled={logMutation.isPending}
              className="flex flex-col h-auto py-3"
              data-testid="button-log-750ml"
            >
              <Droplet className="h-4 w-4 mb-1" />
              <span className="text-xs">750 ml</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => quickLog(1000)}
              disabled={logMutation.isPending}
              className="flex flex-col h-auto py-3"
              data-testid="button-log-1000ml"
            >
              <Droplet className="h-4 w-4 mb-1" />
              <span className="text-xs">1 L</span>
            </Button>
          </div>

          {/* Custom Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Amount (ml)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="flex-1 px-3 py-2 border border-input rounded-md text-sm"
                placeholder="Enter amount"
                data-testid="input-custom-water"
              />
              <Button
                onClick={() => quickLog(parseInt(customAmount) || 0)}
                disabled={logMutation.isPending || !customAmount}
                size="sm"
                data-testid="button-log-custom"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
