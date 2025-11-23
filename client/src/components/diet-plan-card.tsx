import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MealItem {
  time: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface DietPlanCardProps {
  day: string;
  meals: MealItem[];
  totalCalories: number;
}

export function DietPlanCard({ day, meals, totalCalories }: DietPlanCardProps) {
  return (
    <Card data-testid={`card-diet-${day.toLowerCase()}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
        <CardTitle className="font-display">{day}</CardTitle>
        <Badge data-testid="badge-total-calories">
          {totalCalories} cal
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {meals.map((meal, index) => (
            <div
              key={index}
              className="border-l-2 border-primary pl-4 py-2"
              data-testid={`item-meal-${index}`}
            >
              <div className="flex items-start justify-between gap-4 mb-1">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{meal.time}</p>
                  <p className="font-semibold" data-testid="text-meal-name">{meal.name}</p>
                </div>
                <Badge variant="secondary" data-testid="text-meal-calories">
                  {meal.calories} cal
                </Badge>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                <span data-testid="text-protein">P: {meal.protein}g</span>
                <span data-testid="text-carbs">C: {meal.carbs}g</span>
                <span data-testid="text-fats">F: {meal.fats}g</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
