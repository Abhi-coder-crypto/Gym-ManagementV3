import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Download, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type DietGoal = "lose" | "maintain" | "gain";
type DietType = "balanced" | "high_protein" | "low_carb" | "keto" | "vegan";

export function DietPlanGenerator() {
  const [clientName, setClientName] = useState("");
  const [calorieTarget, setCalorieTarget] = useState("");
  const [dietGoal, setDietGoal] = useState<DietGoal>("maintain");
  const [dietType, setDietType] = useState<DietType>("balanced");
  const [mealsPerDay, setMealsPerDay] = useState("4");
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const { toast } = useToast();

  const macroDistributions = {
    balanced: { protein: 30, carbs: 40, fats: 30 },
    high_protein: { protein: 40, carbs: 30, fats: 30 },
    low_carb: { protein: 35, carbs: 25, fats: 40 },
    keto: { protein: 25, carbs: 5, fats: 70 },
    vegan: { protein: 25, carbs: 50, fats: 25 }
  };

  const mealTemplates: Record<DietType, { [key: string]: string[] }> = {
    balanced: {
      breakfast: ["Oatmeal with berries and nuts", "Scrambled eggs with whole grain toast", "Greek yogurt parfait with granola"],
      lunch: ["Grilled chicken salad", "Quinoa bowl with vegetables", "Turkey sandwich with side salad"],
      snack: ["Apple with almond butter", "Protein shake", "Mixed nuts"],
      dinner: ["Baked salmon with sweet potato", "Lean beef stir-fry with rice", "Chicken breast with roasted vegetables"]
    },
    high_protein: {
      breakfast: ["Protein pancakes with eggs", "Scrambled eggs with turkey sausage", "Greek yogurt with protein granola"],
      lunch: ["Grilled chicken breast with quinoa", "Tuna salad with chickpeas", "Beef and veggie bowl"],
      snack: ["Protein shake", "Hard-boiled eggs", "Cottage cheese with berries"],
      dinner: ["Grilled steak with broccoli", "Baked cod with asparagus", "Chicken stir-fry with vegetables"]
    },
    low_carb: {
      breakfast: ["Omelet with cheese and vegetables", "Greek yogurt with nuts", "Scrambled eggs with avocado"],
      lunch: ["Caesar salad with grilled chicken", "Lettuce wrap turkey burger", "Zucchini noodles with meat sauce"],
      snack: ["Cheese and nuts", "Beef jerky", "Celery with almond butter"],
      dinner: ["Grilled salmon with green beans", "Pork chops with cauliflower mash", "Chicken thighs with Brussels sprouts"]
    },
    keto: {
      breakfast: ["Bacon and eggs with avocado", "Keto smoothie with coconut oil", "Cheese omelet with spinach"],
      lunch: ["Cobb salad with ranch", "Bunless burger with cheese", "Chicken thighs with keto coleslaw"],
      snack: ["Macadamia nuts", "Cheese cubes", "Pork rinds"],
      dinner: ["Ribeye steak with butter", "Salmon with creamy sauce", "Pork belly with sautéed greens"]
    },
    vegan: {
      breakfast: ["Tofu scramble with vegetables", "Smoothie bowl with seeds", "Overnight oats with plant milk"],
      lunch: ["Chickpea Buddha bowl", "Lentil soup with bread", "Quinoa salad with beans"],
      snack: ["Hummus with vegetables", "Trail mix", "Fruit with nut butter"],
      dinner: ["Tofu stir-fry with brown rice", "Black bean tacos", "Lentil curry with quinoa"]
    }
  };

  const handleGenerate = () => {
    if (!clientName.trim() || !calorieTarget) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const calories = parseInt(calorieTarget);
    const macros = macroDistributions[dietType];
    const proteinCal = Math.round((calories * macros.protein) / 100);
    const carbsCal = Math.round((calories * macros.carbs) / 100);
    const fatsCal = Math.round((calories * macros.fats) / 100);

    const meals = mealTemplates[dietType];
    const mealsCount = parseInt(mealsPerDay);
    const caloriesPerMeal = Math.round(calories / mealsCount);

    const mealPlan = [];
    if (mealsCount >= 1) mealPlan.push({ name: "Breakfast", calories: caloriesPerMeal, options: meals.breakfast });
    if (mealsCount >= 2) mealPlan.push({ name: "Lunch", calories: caloriesPerMeal, options: meals.lunch });
    if (mealsCount >= 3) mealPlan.push({ name: "Snack", calories: Math.round(calories * 0.1), options: meals.snack });
    if (mealsCount >= 4) mealPlan.push({ name: "Dinner", calories: caloriesPerMeal, options: meals.dinner });
    if (mealsCount >= 5) mealPlan.push({ name: "Evening Snack", calories: Math.round(calories * 0.1), options: meals.snack });
    if (mealsCount >= 6) mealPlan.push({ name: "Pre-Workout", calories: Math.round(calories * 0.1), options: meals.snack });

    setGeneratedPlan({
      clientName,
      calories,
      goal: dietGoal,
      type: dietType,
      macros: {
        protein: { grams: Math.round(proteinCal / 4), percentage: macros.protein },
        carbs: { grams: Math.round(carbsCal / 4), percentage: macros.carbs },
        fats: { grams: Math.round(fatsCal / 9), percentage: macros.fats }
      },
      meals: mealPlan,
      createdDate: new Date().toLocaleDateString()
    });

    toast({
      title: "Diet plan generated!",
      description: `Created ${calories}-calorie plan for ${clientName}`,
    });
  };

  const handleExport = () => {
    if (!generatedPlan) {
      toast({
        title: "No plan to export",
        description: "Please generate a diet plan first",
        variant: "destructive",
      });
      return;
    }

    const content = `
DIET PLAN FOR ${generatedPlan.clientName.toUpperCase()}
Goal: ${generatedPlan.goal === 'lose' ? 'Weight Loss' : generatedPlan.goal === 'gain' ? 'Weight Gain' : 'Maintenance'}
Diet Type: ${dietType.replace('_', ' ').toUpperCase()}
Created: ${generatedPlan.createdDate}

DAILY TARGETS
Total Calories: ${generatedPlan.calories} cal
Protein: ${generatedPlan.macros.protein.grams}g (${generatedPlan.macros.protein.percentage}%)
Carbs: ${generatedPlan.macros.carbs.grams}g (${generatedPlan.macros.carbs.percentage}%)
Fats: ${generatedPlan.macros.fats.grams}g (${generatedPlan.macros.fats.percentage}%)

MEAL PLAN
${generatedPlan.meals.map((meal: any) => `
${meal.name.toUpperCase()} (~${meal.calories} cal)
Options:
${meal.options.map((option: string) => `  • ${option}`).join('\n')}
`).join('\n')}

NOTES:
- Drink at least 8 glasses of water daily
- Adjust portion sizes to meet calorie targets
- Rotate meal options to maintain variety
- Track your macros using a food tracking app
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diet-plan-${generatedPlan.clientName.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Plan exported!",
      description: "Diet plan downloaded successfully",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5" />
            Diet Plan Generator
          </CardTitle>
          <CardDescription>
            Create personalized diet plans based on calorie targets and goals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client-name-diet">Client Name</Label>
              <Input
                id="client-name-diet"
                placeholder="Enter client name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                data-testid="input-client-name-diet"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calorie-target">Daily Calorie Target</Label>
              <Input
                id="calorie-target"
                type="number"
                placeholder="1900"
                value={calorieTarget}
                onChange={(e) => setCalorieTarget(e.target.value)}
                data-testid="input-calorie-target"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diet-goal">Goal</Label>
              <Select value={dietGoal} onValueChange={(val: DietGoal) => setDietGoal(val)}>
                <SelectTrigger id="diet-goal" data-testid="select-diet-goal">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose">Lose Weight</SelectItem>
                  <SelectItem value="maintain">Maintain Weight</SelectItem>
                  <SelectItem value="gain">Gain Weight</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="diet-type">Diet Type</Label>
              <Select value={dietType} onValueChange={(val: DietType) => setDietType(val)}>
                <SelectTrigger id="diet-type" data-testid="select-diet-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="high_protein">High Protein</SelectItem>
                  <SelectItem value="low_carb">Low Carb</SelectItem>
                  <SelectItem value="keto">Ketogenic</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="meals">Meals Per Day</Label>
              <Select value={mealsPerDay} onValueChange={setMealsPerDay}>
                <SelectTrigger id="meals" data-testid="select-meals">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 meals</SelectItem>
                  <SelectItem value="4">4 meals</SelectItem>
                  <SelectItem value="5">5 meals</SelectItem>
                  <SelectItem value="6">6 meals</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleGenerate} className="w-full" data-testid="button-generate-diet-plan">
            <Plus className="h-4 w-4 mr-2" />
            Generate Diet Plan
          </Button>
        </CardContent>
      </Card>

      {generatedPlan && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Diet Plan for {generatedPlan.clientName}</CardTitle>
              <Button onClick={handleExport} variant="outline" data-testid="button-export-diet-plan">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <CardDescription>
              {generatedPlan.calories} calories • {dietType.replace('_', ' ')} • Created {generatedPlan.createdDate}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Daily Macronutrient Targets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-chart-2/10 rounded-md">
                    <div className="text-2xl font-bold font-display text-chart-2">
                      {generatedPlan.macros.protein.grams}g
                    </div>
                    <div className="text-sm text-muted-foreground">Protein</div>
                    <Badge className="mt-1 bg-chart-2">{generatedPlan.macros.protein.percentage}%</Badge>
                  </div>
                  <div className="text-center p-3 bg-chart-3/10 rounded-md">
                    <div className="text-2xl font-bold font-display text-chart-3">
                      {generatedPlan.macros.carbs.grams}g
                    </div>
                    <div className="text-sm text-muted-foreground">Carbs</div>
                    <Badge className="mt-1 bg-chart-3">{generatedPlan.macros.carbs.percentage}%</Badge>
                  </div>
                  <div className="text-center p-3 bg-chart-1/10 rounded-md">
                    <div className="text-2xl font-bold font-display text-chart-1">
                      {generatedPlan.macros.fats.grams}g
                    </div>
                    <div className="text-sm text-muted-foreground">Fats</div>
                    <Badge className="mt-1 bg-chart-1">{generatedPlan.macros.fats.percentage}%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {generatedPlan.meals.map((meal: any, index: number) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{meal.name}</CardTitle>
                      <Badge variant="outline">~{meal.calories} cal</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">Options:</p>
                    <ul className="space-y-1">
                      {meal.options.map((option: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          {option}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
