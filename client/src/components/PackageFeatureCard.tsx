import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, CheckCircle2 } from "lucide-react";
import { FEATURE_LABELS, FEATURE_DESCRIPTIONS } from "@/lib/featureAccess";
import { Button } from "@/components/ui/button";

interface PackageFeatureCardProps {
  feature: string;
  hasAccess: boolean;
  isSubscriptionActive: boolean;
  onUpgrade?: () => void;
  requiredPackage?: string;
}

export function PackageFeatureCard({
  feature,
  hasAccess,
  isSubscriptionActive,
  onUpgrade,
  requiredPackage
}: PackageFeatureCardProps) {
  const label = FEATURE_LABELS[feature] || feature;
  const description = FEATURE_DESCRIPTIONS[feature] || '';
  
  const canAccess = hasAccess && isSubscriptionActive;

  return (
    <Card className={`${canAccess ? '' : 'opacity-60'}`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{label}</CardTitle>
            {canAccess ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Lock className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </CardHeader>
      
      {!canAccess && (
        <CardContent>
          {!isSubscriptionActive ? (
            <Badge variant="destructive" className="mt-2">Subscription Expired</Badge>
          ) : (
            <div className="space-y-2">
              {requiredPackage && (
                <p className="text-sm text-muted-foreground">
                  Available in <Badge variant="outline">{requiredPackage}</Badge>
                </p>
              )}
              {onUpgrade && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={onUpgrade}
                  className="w-full"
                >
                  Upgrade Package
                </Button>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
