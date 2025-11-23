import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { getRemainingDays } from "@/lib/featureAccess";

interface SubscriptionCardProps {
  packageName: string | null;
  subscriptionStartDate: any;
  subscriptionEndDate: any;
  accessDurationWeeks: number;
  onRenew?: () => void;
  onUpgrade?: () => void;
}

export function SubscriptionCard({
  packageName,
  subscriptionStartDate,
  subscriptionEndDate,
  accessDurationWeeks,
  onRenew,
  onUpgrade
}: SubscriptionCardProps) {
  const remainingDays = getRemainingDays(subscriptionEndDate);
  const isActive = remainingDays > 0;
  const isExpiringSoon = remainingDays > 0 && remainingDays <= 7;

  return (
    <Card className={isExpiringSoon ? 'border-yellow-500/50' : isActive ? 'border-green-500/50' : 'border-red-500/50'}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-4">
        <div>
          <CardTitle>Subscription Status</CardTitle>
        </div>
        <Badge 
          variant={isActive ? 'default' : 'destructive'}
          className={isExpiringSoon ? 'bg-yellow-500' : ''}
        >
          {isActive ? 'Active' : 'Expired'}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Package</p>
            <p className="font-semibold">{packageName || 'None'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="font-semibold">{accessDurationWeeks} Weeks</p>
          </div>
          
          {subscriptionStartDate && (
            <div>
              <p className="text-sm text-muted-foreground">Started</p>
              <p className="font-semibold text-sm">
                {format(new Date(subscriptionStartDate), 'MMM dd, yyyy')}
              </p>
            </div>
          )}
          
          {subscriptionEndDate && (
            <div>
              <p className="text-sm text-muted-foreground">Expires</p>
              <p className="font-semibold text-sm">
                {format(new Date(subscriptionEndDate), 'MMM dd, yyyy')}
              </p>
            </div>
          )}
        </div>

        {isExpiringSoon && (
          <div className="flex items-gap gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Your subscription expires in {remainingDays} day{remainingDays !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {!isActive && (
          <div className="flex items-gap gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200">
              Your subscription has expired. Renew to regain access.
            </p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {onRenew && (
            <Button onClick={onRenew} variant="default" className="flex-1">
              Renew Subscription
            </Button>
          )}
          {onUpgrade && (
            <Button onClick={onUpgrade} variant="outline" className="flex-1">
              Upgrade Package
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
