import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { WorkoutPlan } from './models';

dotenv.config({ override: true });

const workoutTemplates = [
  // WEIGHT LOSS PLAN - 7 Days
  {
    name: "Fat Burn Complete - Weight Loss",
    description: "High-intensity 7-day workout plan designed for maximum calorie burn and fat loss. Combines strength training with cardio for optimal results.",
    category: "weight_loss",
    difficulty: "intermediate",
    durationWeeks: 8,
    isTemplate: true,
    createdBy: "admin",
    exercises: {
      Monday: {
        muscleGroup: "Full Body HIIT",
        exercises: [
          { name: "Burpees", sets: 4, reps: "12-15", rest: "45s", notes: "Focus on explosive movement" },
          { name: "Mountain Climbers", sets: 4, reps: "20 each leg", rest: "45s", notes: "Keep core tight" },
          { name: "Jump Squats", sets: 4, reps: "15-20", rest: "45s", notes: "Land softly" },
          { name: "High Knees", sets: 4, reps: "30 seconds", rest: "30s", notes: "Maximum intensity" },
          { name: "Plank to Push-up", sets: 3, reps: "10-12", rest: "45s", notes: "Maintain form" },
          { name: "Jump Lunges", sets: 3, reps: "12 each leg", rest: "45s", notes: "Alternate legs" },
        ]
      },
      Tuesday: {
        muscleGroup: "Upper Body & Core",
        exercises: [
          { name: "Push-ups", sets: 4, reps: "15-20", rest: "60s", notes: "Chest to ground" },
          { name: "Dumbbell Rows", sets: 4, reps: "15-18", rest: "60s", notes: "Squeeze shoulder blades" },
          { name: "Dumbbell Shoulder Press", sets: 3, reps: "12-15", rest: "60s", notes: "Full range of motion" },
          { name: "Tricep Dips", sets: 3, reps: "12-15", rest: "45s", notes: "Elbows back" },
          { name: "Bicycle Crunches", sets: 4, reps: "20 each side", rest: "30s", notes: "Slow and controlled" },
          { name: "Plank", sets: 3, reps: "45-60 seconds", rest: "30s", notes: "Straight body line" },
        ]
      },
      Wednesday: {
        muscleGroup: "Cardio & Legs",
        exercises: [
          { name: "Running/Jogging", sets: 1, reps: "25-30 minutes", rest: "N/A", notes: "Steady pace" },
          { name: "Bodyweight Squats", sets: 4, reps: "20-25", rest: "45s", notes: "Deep squats" },
          { name: "Walking Lunges", sets: 4, reps: "15 each leg", rest: "45s", notes: "Long strides" },
          { name: "Calf Raises", sets: 4, reps: "20-25", rest: "30s", notes: "Full extension" },
          { name: "Side Leg Raises", sets: 3, reps: "15 each side", rest: "30s", notes: "Controlled movement" },
          { name: "Wall Sit", sets: 3, reps: "45-60 seconds", rest: "45s", notes: "90-degree angle" },
        ]
      },
      Thursday: {
        muscleGroup: "Full Body Circuit",
        exercises: [
          { name: "Kettlebell Swings", sets: 4, reps: "15-20", rest: "45s", notes: "Hip drive power" },
          { name: "Box Jumps", sets: 4, reps: "10-12", rest: "60s", notes: "Soft landing" },
          { name: "Battle Ropes", sets: 4, reps: "30 seconds", rest: "45s", notes: "Maximum intensity" },
          { name: "Medicine Ball Slams", sets: 4, reps: "12-15", rest: "45s", notes: "Full body power" },
          { name: "Rowing Machine", sets: 3, reps: "2 minutes", rest: "60s", notes: "High intensity" },
          { name: "Russian Twists", sets: 3, reps: "20 each side", rest: "30s", notes: "Use weight if possible" },
        ]
      },
      Friday: {
        muscleGroup: "Upper Body Strength",
        exercises: [
          { name: "Bench Press", sets: 4, reps: "12-15", rest: "60s", notes: "Controlled descent" },
          { name: "Pull-ups/Assisted Pull-ups", sets: 4, reps: "8-12", rest: "60s", notes: "Full extension" },
          { name: "Dumbbell Flyes", sets: 3, reps: "12-15", rest: "45s", notes: "Stretch at bottom" },
          { name: "Lateral Raises", sets: 3, reps: "15-18", rest: "45s", notes: "Light weight, high reps" },
          { name: "Cable Face Pulls", sets: 3, reps: "15-18", rest: "45s", notes: "Pull to face level" },
          { name: "Hanging Leg Raises", sets: 3, reps: "10-15", rest: "45s", notes: "Control the swing" },
        ]
      },
      Saturday: {
        muscleGroup: "Lower Body Power",
        exercises: [
          { name: "Goblet Squats", sets: 4, reps: "15-20", rest: "60s", notes: "Hold weight at chest" },
          { name: "Romanian Deadlifts", sets: 4, reps: "12-15", rest: "60s", notes: "Feel hamstring stretch" },
          { name: "Bulgarian Split Squats", sets: 3, reps: "12 each leg", rest: "60s", notes: "Back foot elevated" },
          { name: "Leg Press", sets: 4, reps: "15-20", rest: "60s", notes: "Full range of motion" },
          { name: "Step-ups", sets: 3, reps: "15 each leg", rest: "45s", notes: "Drive through heel" },
          { name: "Bicycle", sets: 4, reps: "60 seconds", rest: "30s", notes: "Fast pace for cardio" },
        ]
      },
      Sunday: {
        muscleGroup: "Active Recovery & Core",
        exercises: [
          { name: "Light Jog/Walk", sets: 1, reps: "20-30 minutes", rest: "N/A", notes: "Easy pace" },
          { name: "Yoga Flow", sets: 1, reps: "15-20 minutes", rest: "N/A", notes: "Focus on stretching" },
          { name: "Dead Bug", sets: 3, reps: "12 each side", rest: "30s", notes: "Press lower back down" },
          { name: "Bird Dog", sets: 3, reps: "12 each side", rest: "30s", notes: "Maintain balance" },
          { name: "Cat-Cow Stretch", sets: 3, reps: "10 reps", rest: "20s", notes: "Slow and controlled" },
          { name: "Child's Pose", sets: 1, reps: "2-3 minutes", rest: "N/A", notes: "Deep breathing" },
        ]
      }
    }
  },

  // WEIGHT GAIN / MUSCLE BUILDING PLAN - 7 Days
  {
    name: "Mass Builder Pro - Muscle Gain",
    description: "Progressive 7-day strength training program focused on hypertrophy and muscle building. Emphasizes compound movements and progressive overload.",
    category: "weight_gain",
    difficulty: "intermediate",
    durationWeeks: 12,
    isTemplate: true,
    createdBy: "admin",
    exercises: {
      Monday: {
        muscleGroup: "Chest & Triceps",
        exercises: [
          { name: "Barbell Bench Press", sets: 4, reps: "8-10", rest: "90s", notes: "Heavy weight, progressive overload" },
          { name: "Incline Dumbbell Press", sets: 4, reps: "8-12", rest: "90s", notes: "30-45 degree incline" },
          { name: "Cable Chest Flyes", sets: 3, reps: "10-12", rest: "60s", notes: "Squeeze at peak contraction" },
          { name: "Dips (Weighted)", sets: 3, reps: "8-10", rest: "90s", notes: "Add weight when possible" },
          { name: "Skull Crushers", sets: 3, reps: "10-12", rest: "60s", notes: "Keep elbows stationary" },
          { name: "Cable Tricep Pushdowns", sets: 3, reps: "12-15", rest: "60s", notes: "Full extension" },
        ]
      },
      Tuesday: {
        muscleGroup: "Back & Biceps",
        exercises: [
          { name: "Deadlifts", sets: 4, reps: "6-8", rest: "120s", notes: "Focus on form, heavy weight" },
          { name: "Barbell Rows", sets: 4, reps: "8-10", rest: "90s", notes: "Pull to lower chest" },
          { name: "Lat Pulldowns", sets: 4, reps: "10-12", rest: "60s", notes: "Wide grip" },
          { name: "Seated Cable Rows", sets: 3, reps: "10-12", rest: "60s", notes: "Squeeze shoulder blades" },
          { name: "Barbell Curls", sets: 4, reps: "8-10", rest: "60s", notes: "Strict form" },
          { name: "Hammer Curls", sets: 3, reps: "10-12", rest: "60s", notes: "Neutral grip" },
        ]
      },
      Wednesday: {
        muscleGroup: "Legs (Quads Focus)",
        exercises: [
          { name: "Barbell Back Squats", sets: 5, reps: "6-8", rest: "120s", notes: "Deep squats, heavy weight" },
          { name: "Leg Press", sets: 4, reps: "10-12", rest: "90s", notes: "Full range of motion" },
          { name: "Front Squats", sets: 3, reps: "8-10", rest: "90s", notes: "Upright torso" },
          { name: "Leg Extensions", sets: 3, reps: "12-15", rest: "60s", notes: "Squeeze at top" },
          { name: "Walking Lunges", sets: 3, reps: "12 each leg", rest: "60s", notes: "Hold dumbbells" },
          { name: "Calf Raises (Standing)", sets: 4, reps: "15-20", rest: "45s", notes: "Full stretch and contraction" },
        ]
      },
      Thursday: {
        muscleGroup: "Shoulders & Abs",
        exercises: [
          { name: "Military Press (Barbell)", sets: 4, reps: "8-10", rest: "90s", notes: "Strict overhead press" },
          { name: "Dumbbell Shoulder Press", sets: 4, reps: "10-12", rest: "90s", notes: "Full range of motion" },
          { name: "Lateral Raises", sets: 4, reps: "12-15", rest: "60s", notes: "Control on the way down" },
          { name: "Front Raises", sets: 3, reps: "12-15", rest: "60s", notes: "Alternate arms or both" },
          { name: "Reverse Pec Deck", sets: 3, reps: "12-15", rest: "60s", notes: "Rear delt focus" },
          { name: "Weighted Crunches", sets: 4, reps: "15-20", rest: "45s", notes: "Hold weight on chest" },
        ]
      },
      Friday: {
        muscleGroup: "Legs (Hamstrings & Glutes)",
        exercises: [
          { name: "Romanian Deadlifts", sets: 4, reps: "8-10", rest: "90s", notes: "Feel the stretch" },
          { name: "Lying Leg Curls", sets: 4, reps: "10-12", rest: "60s", notes: "Slow negatives" },
          { name: "Bulgarian Split Squats", sets: 3, reps: "10 each leg", rest: "90s", notes: "Back foot elevated" },
          { name: "Hip Thrusts", sets: 4, reps: "10-12", rest: "90s", notes: "Barbell across hips" },
          { name: "Glute Ham Raises", sets: 3, reps: "8-10", rest: "90s", notes: "Assisted if needed" },
          { name: "Seated Calf Raises", sets: 4, reps: "15-20", rest: "45s", notes: "Full range of motion" },
        ]
      },
      Saturday: {
        muscleGroup: "Arms & Core",
        exercises: [
          { name: "Close-Grip Bench Press", sets: 4, reps: "8-10", rest: "90s", notes: "Hands shoulder-width" },
          { name: "EZ Bar Curls", sets: 4, reps: "10-12", rest: "60s", notes: "Focus on bicep peak" },
          { name: "Overhead Tricep Extension", sets: 3, reps: "10-12", rest: "60s", notes: "Full stretch" },
          { name: "Preacher Curls", sets: 3, reps: "10-12", rest: "60s", notes: "No momentum" },
          { name: "Cable Rope Pushdowns", sets: 3, reps: "12-15", rest: "60s", notes: "Spread rope at bottom" },
          { name: "Hanging Leg Raises", sets: 4, reps: "12-15", rest: "60s", notes: "Raise to 90 degrees" },
        ]
      },
      Sunday: {
        muscleGroup: "Rest & Recovery",
        exercises: [
          { name: "Light Walking", sets: 1, reps: "30 minutes", rest: "N/A", notes: "Active recovery" },
          { name: "Foam Rolling", sets: 1, reps: "15 minutes", rest: "N/A", notes: "All major muscle groups" },
          { name: "Static Stretching", sets: 1, reps: "15 minutes", rest: "N/A", notes: "Hold each stretch 30s" },
          { name: "Meditation/Breathing", sets: 1, reps: "10 minutes", rest: "N/A", notes: "Deep breathing exercises" },
        ]
      }
    }
  },

  // MAINTENANCE PLAN - 7 Days
  {
    name: "Balanced Lifestyle - Maintenance",
    description: "Well-rounded 7-day program for maintaining fitness, strength, and overall health. Combines strength, cardio, and flexibility work.",
    category: "maintenance",
    difficulty: "intermediate",
    durationWeeks: 12,
    isTemplate: true,
    createdBy: "admin",
    exercises: {
      Monday: {
        muscleGroup: "Upper Body Push",
        exercises: [
          { name: "Bench Press", sets: 3, reps: "10-12", rest: "75s", notes: "Moderate weight" },
          { name: "Overhead Press", sets: 3, reps: "10-12", rest: "75s", notes: "Control the weight" },
          { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", rest: "60s", notes: "Focus on form" },
          { name: "Lateral Raises", sets: 3, reps: "12-15", rest: "60s", notes: "Light weight" },
          { name: "Tricep Dips", sets: 3, reps: "10-12", rest: "60s", notes: "Bodyweight or assisted" },
          { name: "Push-ups", sets: 3, reps: "15-20", rest: "45s", notes: "To failure" },
        ]
      },
      Tuesday: {
        muscleGroup: "Lower Body",
        exercises: [
          { name: "Squats", sets: 4, reps: "10-12", rest: "90s", notes: "Moderate weight" },
          { name: "Romanian Deadlifts", sets: 3, reps: "10-12", rest: "75s", notes: "Hip hinge focus" },
          { name: "Leg Press", sets: 3, reps: "12-15", rest: "60s", notes: "Full range of motion" },
          { name: "Lunges", sets: 3, reps: "12 each leg", rest: "60s", notes: "Alternating or walking" },
          { name: "Leg Curls", sets: 3, reps: "12-15", rest: "60s", notes: "Hamstring focus" },
          { name: "Calf Raises", sets: 3, reps: "15-20", rest: "45s", notes: "Standing or seated" },
        ]
      },
      Wednesday: {
        muscleGroup: "Cardio & Core",
        exercises: [
          { name: "Moderate Cardio", sets: 1, reps: "30 minutes", rest: "N/A", notes: "Run, bike, or elliptical" },
          { name: "Plank", sets: 3, reps: "45-60 seconds", rest: "45s", notes: "Maintain straight line" },
          { name: "Russian Twists", sets: 3, reps: "20 each side", rest: "30s", notes: "Use medicine ball" },
          { name: "Leg Raises", sets: 3, reps: "12-15", rest: "45s", notes: "Lower slowly" },
          { name: "Mountain Climbers", sets: 3, reps: "30 seconds", rest: "30s", notes: "High intensity" },
          { name: "Side Plank", sets: 3, reps: "30 seconds each", rest: "30s", notes: "Each side" },
        ]
      },
      Thursday: {
        muscleGroup: "Upper Body Pull",
        exercises: [
          { name: "Pull-ups/Lat Pulldowns", sets: 3, reps: "10-12", rest: "75s", notes: "Full range of motion" },
          { name: "Barbell Rows", sets: 3, reps: "10-12", rest: "75s", notes: "Pull to lower chest" },
          { name: "Face Pulls", sets: 3, reps: "15-18", rest: "60s", notes: "External rotation" },
          { name: "Dumbbell Rows", sets: 3, reps: "10-12", rest: "60s", notes: "Each arm" },
          { name: "Bicep Curls", sets: 3, reps: "12-15", rest: "60s", notes: "Barbell or dumbbell" },
          { name: "Hammer Curls", sets: 3, reps: "12-15", rest: "45s", notes: "Neutral grip" },
        ]
      },
      Friday: {
        muscleGroup: "Full Body Circuit",
        exercises: [
          { name: "Kettlebell Swings", sets: 3, reps: "15-20", rest: "60s", notes: "Hip drive" },
          { name: "Goblet Squats", sets: 3, reps: "12-15", rest: "60s", notes: "Hold at chest" },
          { name: "Push-ups", sets: 3, reps: "15-20", rest: "45s", notes: "Standard or modified" },
          { name: "Dumbbell Rows", sets: 3, reps: "12 each", rest: "60s", notes: "Supported single arm" },
          { name: "Jump Squats", sets: 3, reps: "10-12", rest: "60s", notes: "Explosive movement" },
          { name: "Burpees", sets: 3, reps: "10-12", rest: "60s", notes: "Full body cardio" },
        ]
      },
      Saturday: {
        muscleGroup: "Active Recovery",
        exercises: [
          { name: "Swimming or Cycling", sets: 1, reps: "30-40 minutes", rest: "N/A", notes: "Low intensity" },
          { name: "Yoga Flow", sets: 1, reps: "20 minutes", rest: "N/A", notes: "Focus on flexibility" },
          { name: "Foam Rolling", sets: 1, reps: "10 minutes", rest: "N/A", notes: "All muscle groups" },
          { name: "Dynamic Stretching", sets: 1, reps: "10 minutes", rest: "N/A", notes: "Leg swings, arm circles" },
        ]
      },
      Sunday: {
        muscleGroup: "Rest Day",
        exercises: [
          { name: "Light Walk", sets: 1, reps: "20-30 minutes", rest: "N/A", notes: "Easy pace, enjoy nature" },
          { name: "Meditation", sets: 1, reps: "10 minutes", rest: "N/A", notes: "Focus on breathing" },
          { name: "Mobility Work", sets: 1, reps: "10 minutes", rest: "N/A", notes: "Hip openers, shoulder mobility" },
          { name: "Stretching", sets: 1, reps: "15 minutes", rest: "N/A", notes: "Full body static stretches" },
        ]
      }
    }
  },

  // GENERAL FITNESS PLANS - 7 Different Programs
  {
    name: "Beginner's Full Body Routine",
    description: "Perfect for beginners starting their fitness journey. Focuses on basic movements and building foundational strength.",
    category: "general",
    difficulty: "beginner",
    durationWeeks: 6,
    isTemplate: true,
    createdBy: "admin",
    exercises: {
      Monday: {
        muscleGroup: "Full Body",
        exercises: [
          { name: "Bodyweight Squats", sets: 3, reps: "12-15", rest: "60s", notes: "Focus on form" },
          { name: "Push-ups (Modified if needed)", sets: 3, reps: "8-12", rest: "60s", notes: "Chest to ground" },
          { name: "Walking Lunges", sets: 3, reps: "10 each leg", rest: "60s", notes: "Keep torso upright" },
          { name: "Plank", sets: 3, reps: "20-30 seconds", rest: "45s", notes: "Straight body line" },
          { name: "Glute Bridges", sets: 3, reps: "15-20", rest: "45s", notes: "Squeeze at top" },
        ]
      },
      Wednesday: {
        muscleGroup: "Cardio & Core",
        exercises: [
          { name: "Brisk Walking", sets: 1, reps: "20-25 minutes", rest: "N/A", notes: "Maintain steady pace" },
          { name: "Dead Bug", sets: 3, reps: "10 each side", rest: "30s", notes: "Press lower back down" },
          { name: "Bird Dog", sets: 3, reps: "10 each side", rest: "30s", notes: "Maintain balance" },
          { name: "Side Plank", sets: 2, reps: "15-20 seconds each", rest: "30s", notes: "Both sides" },
          { name: "Cat-Cow Stretch", sets: 2, reps: "10 reps", rest: "20s", notes: "Slow and controlled" },
        ]
      },
      Friday: {
        muscleGroup: "Strength & Balance",
        exercises: [
          { name: "Wall Push-ups", sets: 3, reps: "12-15", rest: "60s", notes: "Easier variation" },
          { name: "Chair Squats", sets: 3, reps: "12-15", rest: "60s", notes: "Touch and stand" },
          { name: "Standing Leg Raises", sets: 3, reps: "12 each leg", rest: "45s", notes: "Hold for balance" },
          { name: "Seated Knee Lifts", sets: 3, reps: "15-20", rest: "45s", notes: "Engage core" },
          { name: "Arm Circles", sets: 2, reps: "20 each direction", rest: "30s", notes: "Light warmup" },
        ]
      }
    }
  },
  {
    name: "Morning Energy Boost Workout",
    description: "Quick and effective morning routine to energize your day. Perfect for all fitness levels.",
    category: "general",
    difficulty: "beginner",
    durationWeeks: 4,
    isTemplate: true,
    createdBy: "admin",
    exercises: {
      "Monday/Wednesday/Friday": {
        muscleGroup: "Full Body Wake-Up",
        exercises: [
          { name: "Jumping Jacks", sets: 3, reps: "30 seconds", rest: "30s", notes: "Get the heart pumping" },
          { name: "Bodyweight Squats", sets: 3, reps: "15-20", rest: "45s", notes: "Deep and controlled" },
          { name: "Push-ups", sets: 3, reps: "10-15", rest: "45s", notes: "Modified on knees if needed" },
          { name: "High Knees", sets: 3, reps: "20 seconds", rest: "30s", notes: "Bring knees to chest" },
          { name: "Plank", sets: 2, reps: "30-45 seconds", rest: "30s", notes: "Hold steady" },
          { name: "Burpees (Light)", sets: 2, reps: "8-10", rest: "60s", notes: "Step back variation OK" },
          { name: "Stretching", sets: 1, reps: "5 minutes", rest: "N/A", notes: "Full body stretch" },
        ]
      }
    }
  },
  {
    name: "Intermediate Full Body Conditioning",
    description: "Well-rounded program for intermediate exercisers. Builds strength, endurance, and flexibility.",
    category: "general",
    difficulty: "intermediate",
    durationWeeks: 8,
    isTemplate: true,
    createdBy: "admin",
    exercises: {
      Monday: {
        muscleGroup: "Upper Body & Core",
        exercises: [
          { name: "Push-ups", sets: 4, reps: "15-20", rest: "60s", notes: "Standard form" },
          { name: "Dumbbell Rows", sets: 4, reps: "12-15 each", rest: "60s", notes: "Squeeze at top" },
          { name: "Shoulder Press", sets: 3, reps: "12-15", rest: "60s", notes: "Dumbbells or barbell" },
          { name: "Bicep Curls", sets: 3, reps: "12-15", rest: "45s", notes: "Controlled movement" },
          { name: "Tricep Dips", sets: 3, reps: "12-15", rest: "45s", notes: "Bench or chair" },
          { name: "Plank to Downward Dog", sets: 3, reps: "10-12", rest: "45s", notes: "Flow movement" },
        ]
      },
      Wednesday: {
        muscleGroup: "Lower Body & Cardio",
        exercises: [
          { name: "Goblet Squats", sets: 4, reps: "15-20", rest: "60s", notes: "Hold weight at chest" },
          { name: "Romanian Deadlifts", sets: 4, reps: "12-15", rest: "60s", notes: "Feel hamstring stretch" },
          { name: "Walking Lunges", sets: 3, reps: "12 each leg", rest: "60s", notes: "Long strides" },
          { name: "Jump Squats", sets: 3, reps: "12-15", rest: "60s", notes: "Explosive power" },
          { name: "Mountain Climbers", sets: 3, reps: "30 seconds", rest: "45s", notes: "Fast pace" },
          { name: "Calf Raises", sets: 3, reps: "20-25", rest: "30s", notes: "Full extension" },
        ]
      },
      Friday: {
        muscleGroup: "Full Body Circuit",
        exercises: [
          { name: "Burpees", sets: 4, reps: "12-15", rest: "60s", notes: "Full movement" },
          { name: "Kettlebell Swings", sets: 4, reps: "15-20", rest: "60s", notes: "Hip drive" },
          { name: "Box Jumps", sets: 3, reps: "10-12", rest: "75s", notes: "Soft landing" },
          { name: "Battle Ropes", sets: 3, reps: "30 seconds", rest: "60s", notes: "Maximum intensity" },
          { name: "Russian Twists", sets: 3, reps: "20 each side", rest: "30s", notes: "Use weight" },
          { name: "Bicycle Crunches", sets: 3, reps: "20 each side", rest: "30s", notes: "Slow and controlled" },
        ]
      }
    }
  },
  {
    name: "Advanced Athletic Performance",
    description: "High-intensity program for advanced athletes. Focuses on power, agility, and peak performance.",
    category: "general",
    difficulty: "advanced",
    durationWeeks: 10,
    isTemplate: true,
    createdBy: "admin",
    exercises: {
      Monday: {
        muscleGroup: "Power & Strength",
        exercises: [
          { name: "Power Cleans", sets: 5, reps: "5-6", rest: "120s", notes: "Explosive movement" },
          { name: "Barbell Squats", sets: 5, reps: "6-8", rest: "120s", notes: "Heavy weight" },
          { name: "Deadlifts", sets: 4, reps: "6-8", rest: "120s", notes: "Perfect form" },
          { name: "Bench Press", sets: 4, reps: "8-10", rest: "90s", notes: "Progressive overload" },
          { name: "Pull-ups (Weighted)", sets: 4, reps: "8-10", rest: "90s", notes: "Add weight" },
          { name: "Box Jumps", sets: 4, reps: "10-12", rest: "60s", notes: "Maximum height" },
        ]
      },
      Tuesday: {
        muscleGroup: "Speed & Agility",
        exercises: [
          { name: "Sprint Intervals", sets: 8, reps: "30s sprint/30s rest", rest: "N/A", notes: "Maximum effort" },
          { name: "Ladder Drills", sets: 4, reps: "3 patterns", rest: "60s", notes: "Quick feet" },
          { name: "Cone Drills", sets: 4, reps: "5-5-5 pattern", rest: "60s", notes: "Sharp cuts" },
          { name: "Plyometric Lunges", sets: 4, reps: "10 each leg", rest: "60s", notes: "Explosive jumps" },
          { name: "Burpee Box Jump Over", sets: 4, reps: "10-12", rest: "75s", notes: "Continuous movement" },
        ]
      },
      Thursday: {
        muscleGroup: "Olympic Lifts & Core",
        exercises: [
          { name: "Snatch", sets: 5, reps: "3-5", rest: "150s", notes: "Technical precision" },
          { name: "Front Squats", sets: 4, reps: "8-10", rest: "90s", notes: "Upright torso" },
          { name: "Push Press", sets: 4, reps: "8-10", rest: "90s", notes: "Leg drive" },
          { name: "Barbell Rows", sets: 4, reps: "10-12", rest: "75s", notes: "Heavy weight" },
          { name: "Hanging Leg Raises", sets: 4, reps: "12-15", rest: "60s", notes: "Straight legs" },
          { name: "Ab Wheel Rollouts", sets: 3, reps: "10-12", rest: "60s", notes: "Full extension" },
        ]
      },
      Saturday: {
        muscleGroup: "Metabolic Conditioning",
        exercises: [
          { name: "Rowing Machine", sets: 5, reps: "500m", rest: "90s", notes: "Sprint pace" },
          { name: "Assault Bike", sets: 4, reps: "30 seconds", rest: "60s", notes: "All out effort" },
          { name: "Kettlebell Swings", sets: 4, reps: "20-25", rest: "60s", notes: "Heavy weight" },
          { name: "Thrusters", sets: 4, reps: "12-15", rest: "75s", notes: "Squat to press" },
          { name: "Battle Ropes", sets: 4, reps: "45 seconds", rest: "60s", notes: "Waves/slams" },
          { name: "Sled Push", sets: 4, reps: "30 meters", rest: "90s", notes: "Heavy load" },
        ]
      }
    }
  },
  {
    name: "Active Senior Wellness Program",
    description: "Safe and effective program designed for seniors and older adults. Focuses on mobility, balance, and functional strength.",
    category: "general",
    difficulty: "beginner",
    durationWeeks: 8,
    isTemplate: true,
    createdBy: "admin",
    exercises: {
      "Monday/Wednesday/Friday": {
        muscleGroup: "Functional Fitness",
        exercises: [
          { name: "Chair Squats", sets: 3, reps: "10-12", rest: "60s", notes: "Use chair for support" },
          { name: "Wall Push-ups", sets: 3, reps: "10-15", rest: "60s", notes: "Easier than floor" },
          { name: "Standing Leg Raises", sets: 3, reps: "10 each leg", rest: "45s", notes: "Hold chair for balance" },
          { name: "Seated Arm Raises", sets: 3, reps: "12-15", rest: "45s", notes: "Light weights optional" },
          { name: "Marching in Place", sets: 3, reps: "30 seconds", rest: "30s", notes: "Lift knees high" },
          { name: "Ankle Circles", sets: 2, reps: "10 each direction", rest: "20s", notes: "Both ankles" },
          { name: "Seated Forward Bend", sets: 2, reps: "Hold 20s", rest: "30s", notes: "Gentle stretch" },
        ]
      },
      "Tuesday/Thursday": {
        muscleGroup: "Balance & Flexibility",
        exercises: [
          { name: "Single Leg Stand", sets: 3, reps: "15-20s each leg", rest: "30s", notes: "Hold chair if needed" },
          { name: "Heel-to-Toe Walk", sets: 3, reps: "10 steps", rest: "45s", notes: "Like a tightrope" },
          { name: "Tai Chi Movements", sets: 1, reps: "10 minutes", rest: "N/A", notes: "Slow and flowing" },
          { name: "Neck Stretches", sets: 2, reps: "10 each direction", rest: "20s", notes: "Gentle movement" },
          { name: "Shoulder Rolls", sets: 2, reps: "15 each direction", rest: "20s", notes: "Release tension" },
          { name: "Seated Spinal Twist", sets: 2, reps: "Hold 15s each side", rest: "20s", notes: "Gentle rotation" },
        ]
      }
    }
  },
  {
    name: "30-Minute Express Workout",
    description: "Time-efficient full body workout for busy schedules. Maximum results in minimal time.",
    category: "general",
    difficulty: "intermediate",
    durationWeeks: 6,
    isTemplate: true,
    createdBy: "admin",
    exercises: {
      "Any Day": {
        muscleGroup: "Full Body Express",
        exercises: [
          { name: "Jumping Jacks", sets: 1, reps: "2 minutes", rest: "30s", notes: "Warm-up" },
          { name: "Push-ups", sets: 3, reps: "15-20", rest: "30s", notes: "Quick pace" },
          { name: "Bodyweight Squats", sets: 3, reps: "20-25", rest: "30s", notes: "Deep squats" },
          { name: "Burpees", sets: 3, reps: "12-15", rest: "45s", notes: "Full movement" },
          { name: "Plank", sets: 3, reps: "45-60 seconds", rest: "30s", notes: "Hold strong" },
          { name: "Mountain Climbers", sets: 3, reps: "30 seconds", rest: "30s", notes: "Fast pace" },
          { name: "Jump Lunges", sets: 3, reps: "10 each leg", rest: "45s", notes: "Alternating" },
          { name: "Russian Twists", sets: 3, reps: "20 each side", rest: "30s", notes: "Use weight" },
          { name: "High Knees", sets: 3, reps: "30 seconds", rest: "30s", notes: "Maximum intensity" },
          { name: "Cool-down Stretch", sets: 1, reps: "3 minutes", rest: "N/A", notes: "Full body" },
        ]
      }
    }
  },
  {
    name: "Bodyweight Mastery Program",
    description: "Advanced bodyweight training program. Build impressive strength using only your body weight.",
    category: "general",
    difficulty: "advanced",
    durationWeeks: 12,
    isTemplate: true,
    createdBy: "admin",
    exercises: {
      Monday: {
        muscleGroup: "Push Day",
        exercises: [
          { name: "Handstand Push-ups", sets: 4, reps: "6-10", rest: "120s", notes: "Wall-assisted if needed" },
          { name: "Archer Push-ups", sets: 4, reps: "8-10 each side", rest: "90s", notes: "One arm focus" },
          { name: "Diamond Push-ups", sets: 4, reps: "12-15", rest: "60s", notes: "Tricep emphasis" },
          { name: "Pike Push-ups", sets: 3, reps: "12-15", rest: "60s", notes: "Shoulder focus" },
          { name: "Plyo Push-ups", sets: 3, reps: "10-12", rest: "75s", notes: "Explosive power" },
          { name: "Tricep Dips", sets: 3, reps: "15-20", rest: "60s", notes: "Deep range" },
        ]
      },
      Wednesday: {
        muscleGroup: "Pull Day",
        exercises: [
          { name: "Muscle-ups", sets: 4, reps: "5-8", rest: "120s", notes: "Explosive pull" },
          { name: "One-Arm Pull-ups (Assisted)", sets: 4, reps: "3-5 each side", rest: "120s", notes: "Use assistance" },
          { name: "Wide Grip Pull-ups", sets: 4, reps: "10-12", rest: "90s", notes: "Lat focus" },
          { name: "Australian Pull-ups", sets: 4, reps: "15-20", rest: "60s", notes: "Body rows" },
          { name: "Hanging Leg Raises", sets: 4, reps: "15-20", rest: "60s", notes: "Straight legs" },
          { name: "Front Lever Progressions", sets: 3, reps: "10-15s hold", rest: "90s", notes: "Tuck/advanced tuck" },
        ]
      },
      Friday: {
        muscleGroup: "Legs & Core",
        exercises: [
          { name: "Pistol Squats", sets: 4, reps: "8-10 each leg", rest: "90s", notes: "Single leg squats" },
          { name: "Jump Squats", sets: 4, reps: "15-20", rest: "60s", notes: "Explosive power" },
          { name: "Bulgarian Split Squats", sets: 4, reps: "12-15 each leg", rest: "75s", notes: "Rear foot elevated" },
          { name: "Nordic Curls", sets: 3, reps: "6-8", rest: "90s", notes: "Hamstring strength" },
          { name: "Dragon Flags", sets: 3, reps: "8-10", rest: "75s", notes: "Core strength" },
          { name: "L-Sit Hold", sets: 3, reps: "15-30 seconds", rest: "60s", notes: "Parallel bars or floor" },
        ]
      }
    }
  }
];

async function seedWorkoutTemplates() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing workout plan templates
    const deletedCount = await WorkoutPlan.deleteMany({ isTemplate: true });
    console.log(`🗑️  Deleted ${deletedCount.deletedCount} existing workout plan templates`);

    // Insert new workout plan templates
    const insertedPlans = await WorkoutPlan.insertMany(workoutTemplates);
    console.log(`✅ Created ${insertedPlans.length} workout plan templates:`);
    
    insertedPlans.forEach((plan, index) => {
      console.log(`   ${index + 1}. ${plan.name} (${plan.category})`);
      console.log(`      - ${Object.keys(plan.exercises).length} days configured`);
      console.log(`      - Difficulty: ${plan.difficulty}`);
      console.log(`      - Duration: ${plan.durationWeeks} weeks`);
    });

    console.log('\n✅ Workout template seeding completed successfully!');
    
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding workout templates:', error);
    process.exit(1);
  }
}

seedWorkoutTemplates();
