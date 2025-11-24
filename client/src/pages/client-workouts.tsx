import { ClientHeader } from "@/components/client-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ContactTrainerDialog } from "@/components/contact-trainer-dialog";
import { Dumbbell, AlertCircle, Flame, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface Exercise {
  name: string;
  sets?: number;
  reps?: string | number;
  weight?: number;
  duration?: number;
  restTime?: number;
  notes?: string;
  difficulty?: string;
  intensity?: string;
}

interface WorkoutPlan {
  _id: string;
  name: string;
  description: string;
  exercises: Record<string, Exercise[]>;
  difficulty: string;
  durationWeeks: number;
  goal?: string;
}

interface DietPlan {
  _id: string;
  meals: Array<{ calories?: number; weekNumber?: number }>;
  targetCalories?: number;
}

interface ClientData {
  weight?: number;
  age?: number;
  gender?: string;
  goal?: string;
}

export default function ClientWorkouts() {
  const [currentWeekDay, setCurrentWeekDay] = useState<string>("");
  const [contactTrainerOpen, setContactTrainerOpen] = useState(false);

  const { data: assignedWorkouts = [], isLoading: isLoadingWorkouts, isError, error } = useQuery<WorkoutPlan[]>({
    queryKey: ['/api/workout-plans'],
  });

  const { data: dietPlans = [] } = useQuery<DietPlan[]>({
    queryKey: ['/api/diet-plans'],
  });

  const { data: clientData } = useQuery<ClientData>({
    queryKey: ['/api/auth/me'],
    select: (data: any) => ({
      weight: data.user?.weight,
      age: data.user?.age,
      gender: data.user?.gender,
      goal: data.user?.goal,
    }),
  });

  const firstWorkout = assignedWorkouts && assignedWorkouts.length > 0 ? assignedWorkouts[0] : null;

  // Extract all unique exercise days from the exercises object
  const getAllUniqueDays = (): string[] => {
    if (!firstWorkout?.exercises) return [];
    const daysSet = new Set<string>();
    
    Object.keys(firstWorkout.exercises).forEach(key => {
      // Split by / or , to handle keys like "Monday/Wednesday/Friday" or "Monday"
      const days = key.split(/[/,\s]+/).map(d => d.trim()).filter(d => d);
      days.forEach(day => daysSet.add(day));
    });
    
    return Array.from(daysSet);
  };

  const availableDays = getAllUniqueDays();

  // Initialize selected day on first load
  useEffect(() => {
    if (availableDays.length > 0 && !currentWeekDay) {
      setCurrentWeekDay(availableDays[0]);
    }
  }, [availableDays, currentWeekDay]);

  // Get exercises for the selected day
  const getCurrentDayExercises = (): Exercise[] => {
    if (!firstWorkout?.exercises || !currentWeekDay) return [];
    
    // Find the key that contains the selected day
    for (const [key, exercises] of Object.entries(firstWorkout.exercises)) {
      const days = key.split(/[/,\s]+/).map(d => d.trim());
      if (days.includes(currentWeekDay) && Array.isArray(exercises)) {
        return exercises;
      }
    }
    return [];
  };

  const currentDayExercises = getCurrentDayExercises();

  // Calculate calories burned from exercises using improved formula
  const calculateCaloriesBurned = (exercises: Exercise[], weight: number = 70, durationHours: number = 1): number => {
    if (!exercises || !Array.isArray(exercises) || exercises.length === 0) return 0;

    // Convert weight to kg if needed
    const weightKg = weight > 100 ? weight / 2.2 : weight;

    const metValues: Record<string, number> = {
      'light': 3.0,
      'beginner': 3.5,
      'moderate': 5.0,
      'intermediate': 7.0,
      'intense': 9.0,
      'advanced': 10.5,
      'high': 12.0,
    };

    let totalCalories = 0;
    let exerciseCount = 0;

    exercises.forEach((ex) => {
      try {
        // Skip exercises without names
        if (!ex.name || ex.name.trim() === '') return;
        
        exerciseCount++;
        
        // Get MET value for this exercise - default to moderate if not specified
        const intensity = (ex.intensity || ex.difficulty || 'moderate').toLowerCase();
        const baseMET = metValues[intensity] || 5.0;
        
        // Base calories from MET value for entire duration
        // Distribute duration evenly across all exercises
        let exerciseCalories = weightKg * baseMET * (durationHours / Math.max(exercises.length, 1));
        
        // Adjust for sets and reps (volume load)
        if (ex.sets && ex.sets > 0 && ex.reps) {
          const repsNum = typeof ex.reps === 'string' 
            ? parseInt(ex.reps.split('-')[0]) || 10 // Handle "10-12" format, default to 10
            : ex.reps || 10;
          const totalReps = ex.sets * repsNum;
          // Each 100 reps = 50% more calories
          const volumeMultiplier = 1 + (totalReps / 100) * 0.5;
          exerciseCalories *= Math.min(volumeMultiplier, 2.5);
        }
        
        // Adjust for weight lifted (resistance training intensity)
        if (ex.weight && ex.weight > 0) {
          // Add intensity based on weight lifted relative to body weight
          const weightMultiplier = 1 + (ex.weight / weightKg) * 0.2;
          exerciseCalories *= Math.min(weightMultiplier, 2.0);
        }
        
        totalCalories += exerciseCalories;
      } catch (err) {
        // Fallback: just use moderate intensity for this exercise
        const baseMET = 5.0;
        totalCalories += weightKg * baseMET * (durationHours / Math.max(exercises.length, 1));
      }
    });

    // If no valid exercises found, return 0
    if (exerciseCount === 0) return 0;

    // Add resting metabolic rate (baseline for the full workout duration)
    const restingCalories = weightKg * 1.0 * durationHours;
    const totalBurned = Math.round(totalCalories + restingCalories);
    
    // Return realistic minimum of 100 calories for any workout
    return Math.max(totalBurned, 100);
  };

  // Get all exercises across all days
  const getAllExercises = (): Exercise[] => {
    if (!firstWorkout?.exercises) return [];
    const all: Exercise[] = [];
    Object.values(firstWorkout.exercises).forEach((dayExercises) => {
      if (Array.isArray(dayExercises)) {
        all.push(...dayExercises);
      }
    });
    return all;
  };

  const allExercises = getAllExercises();
  const dietPlan = dietPlans && dietPlans.length > 0 ? dietPlans[0] : null;
  const dietCalories = dietPlan?.targetCalories || 0;
  
  // Use client weight if available, otherwise default to 70kg for calculation
  const clientWeight = clientData?.weight && clientData.weight > 0 ? clientData.weight : 70;
  const caloriesBurned = firstWorkout && allExercises.length > 0 ? calculateCaloriesBurned(allExercises, clientWeight, 1) : 0;
  const calorieBalance = dietCalories - caloriesBurned;
  const isWeightGain = clientData?.goal?.toLowerCase().includes('weight_gain') || clientData?.goal?.toLowerCase().includes('bulk');

  if (isLoadingWorkouts) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <ClientHeader currentPage="workouts" />
        <main className="flex-1 container mx-auto px-6 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Loading your workout plans...</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <ClientHeader currentPage="workouts" />
        <main className="flex-1 container mx-auto px-6 py-8">
          <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
            <CardContent className="p-8 text-center space-y-4">
              <AlertCircle className="h-16 w-16 mx-auto text-red-500" />
              <h2 className="text-2xl font-bold text-red-900 dark:text-red-100">Error Loading Workouts</h2>
              <p className="text-red-700 dark:text-red-200 max-w-md mx-auto">
                {error instanceof Error ? error.message : "Failed to load your workout plans. Please refresh the page or try again later."}
              </p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()} data-testid="button-retry-workout">
                Retry
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!firstWorkout || availableDays.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <ClientHeader currentPage="workouts" />
        <main className="flex-1 container mx-auto px-6 py-8 max-w-4xl">
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 dark:from-purple-950 dark:to-blue-950 dark:border-purple-800">
            <CardContent className="p-8 text-center space-y-4">
              <Dumbbell className="h-16 w-16 mx-auto text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">No Workout Plan Assigned</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your trainer hasn't assigned a workout plan yet. Please contact your trainer to get a personalized training program tailored to your fitness goals.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => setContactTrainerOpen(true)} data-testid="button-contact-trainer">
                Contact Trainer
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ClientHeader currentPage="workouts" />

      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="space-y-8">
          {/* Header Card */}
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 dark:from-purple-950 dark:to-blue-950 dark:border-purple-800">
            <CardContent className="pt-6">
              <div className="text-center space-y-2 mb-6">
                <div className="w-full h-2 bg-purple-400 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Training Program</h2>
                <p className="text-sm text-muted-foreground">{firstWorkout.name}</p>
              </div>

              {/* Workout Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Duration</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">1 Hour</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Difficulty</p>
                  <Badge className="justify-center w-full capitalize">{firstWorkout.difficulty}</Badge>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Calories Burned</p>
                  <div className="flex items-center justify-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{caloriesBurned}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{firstWorkout.description}</p>

              {/* Day Navigation */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <p className="font-semibold text-gray-900 dark:text-white">Daily Exercises</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                  {availableDays.map((day) => (
                    <Button
                      key={day}
                      variant={currentWeekDay === day ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentWeekDay(day)}
                      className="text-xs"
                      data-testid={`button-day-${day}`}
                    >
                      {day.slice(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Exercises Section */}
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  {currentWeekDay} Exercises ({currentDayExercises.length})
                </h3>

                {currentDayExercises.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">No exercises for {currentWeekDay}</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {currentDayExercises.map((exercise, idx) => (
                      <Card key={idx} className="border-0 bg-white dark:bg-slate-800 hover-elevate">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{exercise.name}</h4>
                              <div className="flex flex-wrap gap-2 text-xs">
                                {exercise.sets && <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">{exercise.sets} sets</span>}
                                {exercise.reps && <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">× {exercise.reps} reps</span>}
                                {exercise.weight && <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">{exercise.weight} kg</span>}
                                {exercise.restTime && <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">Rest: {exercise.restTime}s</span>}
                              </div>
                              {exercise.notes && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{exercise.notes}</p>}
                            </div>
                            {exercise.difficulty && (
                              <Badge variant="outline" className="capitalize whitespace-nowrap">
                                {exercise.difficulty}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Calorie Balance Card */}
          {dietCalories > 0 && (
            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Daily Calorie Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <p className="text-sm text-muted-foreground mb-2">Calories Consumed</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{dietCalories}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">From diet plan</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                    <p className="text-sm text-muted-foreground mb-2">Calories Burned</p>
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{caloriesBurned}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">From 1-hour workout</p>
                  </div>
                  <div className={`${isWeightGain ? 'bg-blue-50 dark:bg-blue-950/30' : 'bg-purple-50 dark:bg-purple-950/30'} rounded-lg p-4 border ${isWeightGain ? 'border-blue-200 dark:border-blue-800' : 'border-purple-200 dark:border-purple-800'}`}>
                    <p className="text-sm text-muted-foreground mb-2">Calorie {isWeightGain ? 'Surplus' : 'Deficit'}</p>
                    <div className="flex items-center gap-2">
                      {isWeightGain ? (
                        <TrendingUp className={`h-5 w-5 ${calorieBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`} />
                      ) : (
                        <TrendingDown className={`h-5 w-5 ${calorieBalance <= 0 ? 'text-purple-600 dark:text-purple-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
                      )}
                      <p className={`text-3xl font-bold ${calorieBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {Math.abs(calorieBalance)}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {isWeightGain ? 'Great for bulking!' : 'Good for weight loss'}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Calorie Balance Progress</span>
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {calorieBalance >= 0 ? '+' : ''}{calorieBalance} calories
                    </span>
                  </div>
                  <Progress value={Math.min(Math.max((dietCalories / (dietCalories + 500)) * 100, 0), 100)} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    {isWeightGain
                      ? calorieBalance >= 0
                        ? 'Perfect! You have a calorie surplus for weight gain.'
                        : 'Increase calories or reduce workout intensity for weight gain.'
                      : calorieBalance <= 0
                        ? 'Great! You have a calorie deficit for weight loss.'
                        : 'Increase workout intensity or reduce calories for weight loss.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💡 Workout Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>✓ Warm up for 5-10 minutes before starting exercises</p>
              <p>✓ Maintain proper form over heavier weights</p>
              <p>✓ Rest as mentioned between sets for optimal recovery</p>
              <p>✓ Hydrate regularly throughout your workout</p>
              <p>✓ Track your progress and gradually increase intensity</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
