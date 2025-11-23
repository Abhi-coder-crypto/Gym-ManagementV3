import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface PackageCardProps {
  name: string;
  price: number;
  period: string;
  features: string[];
  isPopular?: boolean;
  onSelect: () => void;
}

export function PackageCard({
  name,
  price,
  period,
  features,
  isPopular = false,
  onSelect,
}: PackageCardProps) {
  return (
    <Card className="relative flex flex-col h-full" data-testid={`card-package-${name.toLowerCase()}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-chart-2 text-white" data-testid="badge-popular">
            Most Popular
          </Badge>
        </div>
      )}
      <CardHeader className="gap-3">
        <CardTitle className="font-display text-2xl tracking-tight" data-testid={`text-package-name-${name.toLowerCase()}`}>
          {name}
        </CardTitle>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold font-display" data-testid={`text-price-${name.toLowerCase()}`}>
            ${price}
          </span>
          <span className="text-muted-foreground text-sm">/{period}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3" data-testid={`text-feature-${index}`}>
              <Check className="h-5 w-5 text-chart-3 shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={isPopular ? "default" : "outline"}
          onClick={onSelect}
          data-testid={`button-select-${name.toLowerCase()}`}
        >
          Get Started
        </Button>
      </CardFooter>
    </Card>
  );
}
