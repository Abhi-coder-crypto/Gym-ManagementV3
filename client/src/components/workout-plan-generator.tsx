import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Download, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type WorkoutTemplate = "beginner" | "intermediate" | "advanced" | "strength" | "cardio";

export function WorkoutPlanGenerator() {
  const [template, setTemplate] = useState<WorkoutTemplate>("beginner");
  const [duration, setDuration] = useState("7");
  const [clientName, setClientName] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const { toast } = useToast();

  const workoutTemplates = {
    beginner: {
      name: "Beginner Full Body",
      description: "Perfect for those just starting their fitness journey",
      workouts: [
        { day: "Monday", focus: "Full Body", exercises: ["Push-ups (3x8)", "Squats (3x10)", "Plank (3x30s)", "Lunges (3x10)"] },
        { day: "Wednesday", focus: "Cardio & Core", exercises: ["Jump rope (10 min)", "Crunches (3x15)", "Mountain climbers (3x12)", "Burpees (3x8)"] },
        { day: "Friday", focus: "Lower Body", exercises: ["Squats (3x12)", "Lunges (3x10)", "Glute bridges (3x15)", "Calf raises (3x15)"] },
      ]
    },
    intermediate: {
      name: "Intermediate Split",
      description: "For those with some training experience",
      workouts: [
        { day: "Monday", focus: "Upper Body Push", exercises: ["Bench press (4x8)", "Shoulder press (3x10)", "Dips (3x12)", "Tricep extensions (3x12)"] },
        { day: "Tuesday", focus: "Lower Body", exercises: ["Squats (4x8)", "Romanian deadlifts (3x10)", "Leg press (3x12)", "Leg curls (3x12)"] },
        { day: "Thursday", focus: "Upper Body Pull", exercises: ["Pull-ups (4x8)", "Barbell rows (3x10)", "Face pulls (3x15)", "Bicep curls (3x12)"] },
        { day: "Friday", focus: "Full Body", exercises: ["Deadlifts (3x6)", "Front squats (3x8)", "Push press (3x10)", "Chin-ups (3x8)"] },
      ]
    },
    advanced: {
      name: "Advanced Strength",
      description: "High-intensity program for experienced lifters",
      workouts: [
        { day: "Monday", focus: "Chest & Triceps", exercises: ["Bench press (5x5)", "Incline press (4x8)", "Chest flies (3x12)", "Close-grip bench (4x8)", "Skull crushers (3x12)"] },
        { day: "Tuesday", focus: "Back & Biceps", exercises: ["Deadlifts (5x5)", "Weighted pull-ups (4x8)", "Barbell rows (4x8)", "Lat pulldowns (3x12)", "Barbell curls (3x10)"] },
        { day: "Thursday", focus: "Legs", exercises: ["Squats (5x5)", "Front squats (4x6)", "Romanian deadlifts (4x8)", "Leg press (3x12)", "Leg curls (3x12)"] },
        { day: "Friday", focus: "Shoulders & Arms", exercises: ["Overhead press (5x5)", "Arnold press (4x8)", "Lateral raises (3x15)", "Face pulls (3x15)", "21s (3 sets)"] },
        { day: "Saturday", focus: "Full Body Power", exercises: ["Power cleans (4x5)", "Front squats (4x6)", "Push press (4x6)", "Pull-ups (4x8)", "Core circuit (20 min)"] },
      ]
    },
    strength: {
      name: "Strength Focus",
      description: "Build maximum strength with compound movements",
      workouts: [
        { day: "Monday", focus: "Squat Day", exercises: ["Back squats (5x5)", "Front squats (3x8)", "Romanian deadlifts (3x8)", "Core work (15 min)"] },
        { day: "Wednesday", focus: "Bench Day", exercises: ["Bench press (5x5)", "Incline press (4x8)", "Dips (3xAMRAP)", "Tricep work (3x12)"] },
        { day: "Friday", focus: "Deadlift Day", exercises: ["Deadlifts (5x5)", "Barbell rows (4x8)", "Pull-ups (3xAMRAP)", "Bicep work (3x12)"] },
      ]
    },
    cardio: {
      name: "Cardio & Conditioning",
      description: "Improve cardiovascular fitness and endurance",
      workouts: [
        { day: "Monday", focus: "HIIT", exercises: ["Sprint intervals (8 rounds)", "Burpees (5x15)", "Mountain climbers (5x30s)", "Jump rope (10 min)"] },
        { day: "Wednesday", focus: "Steady State", exercises: ["Jogging (30 min)", "Rowing (15 min)", "Cycling (20 min)", "Stretching (10 min)"] },
        { day: "Friday", focus: "Circuit Training", exercises: ["Full body circuit (45 min)", "Battle ropes (5x30s)", "Box jumps (5x10)", "Plank variations (10 min)"] },
      ]
    }
  };

  const handleGenerate = () => {
    if (!clientName.trim()) {
      toast({
        title: "Client name required",
        description: "Please enter a client name",
        variant: "destructive",
      });
      return;
    }

    const selectedTemplate = workoutTemplates[template as keyof typeof workoutTemplates];
    const weeks = Math.ceil(parseInt(duration) / 7);

    setGeneratedPlan({
      clientName,
      template: selectedTemplate.name,
      duration: parseInt(duration),
      weeks,
      workouts: selectedTemplate.workouts,
      createdDate: new Date().toLocaleDateString(),
    });

    toast({
      title: "Workout plan generated!",
      description: `Created ${duration}-day plan for ${clientName}`,
    });
  };

  const handleExport = () => {
    if (!generatedPlan) {
      toast({
        title: "No plan to export",
        description: "Please generate a workout plan first",
        variant: "destructive",
      });
      return;
    }

    const content = `
WORKOUT PLAN FOR ${generatedPlan.clientName.toUpperCase()}
Template: ${generatedPlan.template}
Duration: ${generatedPlan.duration} days (${generatedPlan.weeks} weeks)
Created: ${generatedPlan.createdDate}

${generatedPlan.workouts.map((workout: any) => `
${workout.day.toUpperCase()} - ${workout.focus}
${workout.exercises.map((ex: string) => `  • ${ex}`).join('\n')}
`).join('\n')}

NOTE: Repeat this schedule for ${generatedPlan.weeks} week(s)
Always warm up before and cool down after workouts
Stay hydrated and rest adequately between sessions
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workout-plan-${generatedPlan.clientName.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Plan exported!",
      description: "Workout plan downloaded successfully",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Workout Plan Generator
          </CardTitle>
          <CardDescription>
            Create personalized workout plans from templates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">Client Name</Label>
              <Input
                id="client-name"
                placeholder="Enter client name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                data-testid="input-client-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Plan Duration (days)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration" data-testid="select-duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days (1 week)</SelectItem>
                  <SelectItem value="14">14 days (2 weeks)</SelectItem>
                  <SelectItem value="21">21 days (3 weeks)</SelectItem>
                  <SelectItem value="28">28 days (4 weeks)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="template">Workout Template</Label>
              <Select value={template} onValueChange={(val: WorkoutTemplate) => setTemplate(val)}>
                <SelectTrigger id="template" data-testid="select-template">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner Full Body</SelectItem>
                  <SelectItem value="intermediate">Intermediate Split</SelectItem>
                  <SelectItem value="advanced">Advanced Strength</SelectItem>
                  <SelectItem value="strength">Strength Focus</SelectItem>
                  <SelectItem value="cardio">Cardio & Conditioning</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {workoutTemplates[template].description}
              </p>
            </div>
          </div>
          <Button onClick={handleGenerate} className="w-full" data-testid="button-generate-plan">
            <Plus className="h-4 w-4 mr-2" />
            Generate Workout Plan
          </Button>
        </CardContent>
      </Card>

      {generatedPlan && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Plan for {generatedPlan.clientName}</CardTitle>
              <Button onClick={handleExport} variant="outline" data-testid="button-export-plan">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <CardDescription>
              {generatedPlan.template} • {generatedPlan.duration} days • Created {generatedPlan.createdDate}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              {generatedPlan.workouts.map((workout: any, index: number) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{workout.day}</CardTitle>
                      <Badge>{workout.focus}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {workout.exercises.map((exercise: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          {exercise}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-sm text-muted-foreground text-center p-4 bg-accent/50 rounded-md mt-4">
              Repeat this schedule for {generatedPlan.weeks} week{generatedPlan.weeks > 1 ? 's' : ''}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
