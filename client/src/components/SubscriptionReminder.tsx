import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock } from "lucide-react";
import { getRemainingDays } from "@/lib/featureAccess";

interface SubscriptionReminderProps {
  clientName: string;
  packageName: string;
  subscriptionEndDate: any;
  onRenew?: () => void;
  onUpgrade?: () => void;
}

export function SubscriptionReminder({
  clientName,
  packageName,
  subscriptionEndDate,
  onRenew,
  onUpgrade
}: SubscriptionReminderProps) {
  const remainingDays = getRemainingDays(subscriptionEndDate);
  
  if (remainingDays <= 0) {
    return (
      <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 dark:text-red-100">Subscription Expired</h3>
              <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                {clientName}'s {packageName} subscription has expired. Features are no longer accessible.
              </p>
              <div className="flex gap-2 mt-3">
                {onRenew && (
                  <Button size="sm" onClick={onRenew} className="bg-red-600 hover:bg-red-700">
                    Renew Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (remainingDays <= 7) {
    return (
      <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">Subscription Expiring Soon</h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                {clientName}'s {packageName} subscription expires in {remainingDays} day{remainingDays > 1 ? 's' : ''}.
              </p>
              <div className="flex gap-2 mt-3">
                {onRenew && (
                  <Button size="sm" onClick={onRenew} variant="default">
                    Renew Subscription
                  </Button>
                )}
                {onUpgrade && (
                  <Button size="sm" onClick={onUpgrade} variant="outline">
                    Upgrade Package
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return null;
}
