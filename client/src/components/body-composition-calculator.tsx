import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingDown, TrendingUp, Minus } from "lucide-react";

type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
type Goal = "lose" | "maintain" | "gain";

export function BodyCompositionCalculator() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<Goal>("maintain");
  const [results, setResults] = useState<any>(null);

  const calculateBMI = (weightKg: number, heightM: number): number => {
    return weightKg / (heightM * heightM);
  };

  const calculateBMR = (weightKg: number, heightCm: number, ageYears: number, genderVal: "male" | "female"): number => {
    if (genderVal === "male") {
      return 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
    } else {
      return 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
    }
  };

  const calculateTDEE = (bmr: number, activity: ActivityLevel): number => {
    const multipliers: Record<ActivityLevel, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    return bmr * multipliers[activity];
  };

  const calculateIdealWeight = (heightCm: number, genderVal: "male" | "female"): { min: number; max: number } => {
    const heightM = heightCm / 100;
    const minBMI = 18.5;
    const maxBMI = 24.9;
    return {
      min: minBMI * heightM * heightM,
      max: maxBMI * heightM * heightM
    };
  };

  const getCalorieTarget = (tdee: number, goalType: Goal): number => {
    if (goalType === "lose") return tdee - 500;
    if (goalType === "gain") return tdee + 300;
    return tdee;
  };

  const handleCalculate = () => {
    const weightKg = parseFloat(weight);
    const heightCm = parseFloat(height);
    const ageYears = parseInt(age);

    if (!weightKg || !heightCm || !ageYears) {
      return;
    }

    const heightM = heightCm / 100;
    const bmi = calculateBMI(weightKg, heightM);
    const bmr = calculateBMR(weightKg, heightCm, ageYears, gender);
    const tdee = calculateTDEE(bmr, activityLevel);
    const idealWeight = calculateIdealWeight(heightCm, gender);
    const calorieTarget = getCalorieTarget(tdee, goal);

    let bmiCategory = "";
    if (bmi < 18.5) bmiCategory = "Underweight";
    else if (bmi < 25) bmiCategory = "Normal weight";
    else if (bmi < 30) bmiCategory = "Overweight";
    else bmiCategory = "Obese";

    setResults({
      bmi: bmi.toFixed(1),
      bmiCategory,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      idealWeight,
      calorieTarget: Math.round(calorieTarget),
      goal
    });
  };

  const getBMIColor = (category: string) => {
    if (category === "Normal weight") return "bg-chart-3 text-white";
    if (category === "Underweight") return "bg-chart-4";
    return "bg-chart-1";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Body Metrics Input
          </CardTitle>
          <CardDescription>
            Enter your details to calculate BMI, BMR, TDEE, and calorie recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                data-testid="input-age"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={(value: "male" | "female") => setGender(value)}>
                <SelectTrigger id="gender" data-testid="select-gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                data-testid="input-height"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                data-testid="input-weight"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activity">Activity Level</Label>
              <Select value={activityLevel} onValueChange={(value: ActivityLevel) => setActivityLevel(value)}>
                <SelectTrigger id="activity" data-testid="select-activity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                  <SelectItem value="light">Light (exercise 1-3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
                  <SelectItem value="active">Active (exercise 6-7 days/week)</SelectItem>
                  <SelectItem value="very_active">Very Active (intense exercise daily)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Fitness Goal</Label>
              <Select value={goal} onValueChange={(value: Goal) => setGoal(value)}>
                <SelectTrigger id="goal" data-testid="select-goal">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose">Lose Weight</SelectItem>
                  <SelectItem value="maintain">Maintain Weight</SelectItem>
                  <SelectItem value="gain">Gain Weight</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleCalculate} className="w-full" data-testid="button-calculate">
            Calculate
          </Button>
        </CardContent>
      </Card>

      {results && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Body Mass Index (BMI)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-3">
                <div className="text-4xl font-bold font-display">{results.bmi}</div>
                <Badge className={getBMIColor(results.bmiCategory)}>{results.bmiCategory}</Badge>
                <p className="text-sm text-muted-foreground">
                  Normal range: 18.5 - 24.9
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ideal Weight Range</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-3">
                <div className="text-4xl font-bold font-display">
                  {results.idealWeight.min.toFixed(1)} - {results.idealWeight.max.toFixed(1)}
                </div>
                <p className="text-sm text-muted-foreground">kg</p>
                <p className="text-sm text-muted-foreground">
                  Based on BMI 18.5-24.9
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Basal Metabolic Rate (BMR)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-3">
                <div className="text-4xl font-bold font-display">{results.bmr}</div>
                <p className="text-sm text-muted-foreground">calories/day at rest</p>
                <p className="text-xs text-muted-foreground">
                  Calories your body burns at rest
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Daily Energy Expenditure (TDEE)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-3">
                <div className="text-4xl font-bold font-display">{results.tdee}</div>
                <p className="text-sm text-muted-foreground">calories/day</p>
                <p className="text-xs text-muted-foreground">
                  Total calories burned daily with activity
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {results.goal === "lose" && <TrendingDown className="h-5 w-5 text-chart-1" />}
                {results.goal === "maintain" && <Minus className="h-5 w-5 text-chart-3" />}
                {results.goal === "gain" && <TrendingUp className="h-5 w-5 text-chart-2" />}
                Daily Calorie Target
              </CardTitle>
              <CardDescription>
                {results.goal === "lose" && "For fat loss, target 500 calories below TDEE"}
                {results.goal === "maintain" && "For weight maintenance, match your TDEE"}
                {results.goal === "gain" && "For muscle gain, target 300 calories above TDEE"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6 bg-accent/50 rounded-md">
                <div className="text-5xl font-bold font-display text-primary mb-2">
                  {results.calorieTarget}
                </div>
                <p className="text-lg text-muted-foreground">calories per day</p>
                <p className="text-sm text-muted-foreground mt-4">
                  {results.goal === "lose" && "This should help you lose approximately 0.5 kg per week"}
                  {results.goal === "maintain" && "This will help you maintain your current weight"}
                  {results.goal === "gain" && "This should help you gain muscle while minimizing fat"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
