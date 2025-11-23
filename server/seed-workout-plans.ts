import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { WorkoutPlan } from './models';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const workoutPlans = [
  // WEIGHT LOSS - 7 Days
  {
    name: "Weight Loss - Day 1: Full Body HIIT",
    description: "High-intensity interval training to maximize calorie burn and fat loss",
    goal: "Weight Loss",
    category: "weight_loss",
    durationWeeks: 8,
    difficulty: "intermediate",
    daysPerWeek: 7,
    exercises: [
      { name: "Jumping Jacks", sets: 4, reps: 30, restSeconds: 30, notes: "Warm up with high knees" },
      { name: "Burpees", sets: 4, reps: 15, restSeconds: 45, notes: "Full range of motion" },
      { name: "Mountain Climbers", sets: 4, reps: 30, restSeconds: 30, notes: "Keep core tight" },
      { name: "Jump Squats", sets: 4, reps: 20, restSeconds: 45, notes: "Land softly" },
      { name: "High Knees", sets: 4, reps: 40, restSeconds: 30, notes: "Drive knees up" },
      { name: "Plank to Push-up", sets: 3, reps: 12, restSeconds: 45, notes: "Alternate lead arm" }
    ],
    isTemplate: true
  },
  {
    name: "Weight Loss - Day 2: Cardio & Core",
    description: "Cardio-focused workout with core strengthening exercises",
    goal: "Weight Loss",
    category: "weight_loss",
    durationWeeks: 8,
    difficulty: "intermediate",
    daysPerWeek: 7,
    exercises: [
      { name: "Running/Jogging", sets: 1, reps: 1, restSeconds: 0, notes: "30 minutes steady pace" },
      { name: "Bicycle Crunches", sets: 4, reps: 25, restSeconds: 30, notes: "Touch elbow to knee" },
      { name: "Russian Twists", sets: 4, reps: 30, restSeconds: 30, notes: "Hold weight for intensity" },
      { name: "Leg Raises", sets: 4, reps: 15, restSeconds: 45, notes: "Lower slowly" },
      { name: "Plank Hold", sets: 3, reps: 1, restSeconds: 60, notes: "Hold for 60 seconds" },
      { name: "Mountain Climbers", sets: 3, reps: 40, restSeconds: 30, notes: "Fast pace" }
    ],
    isTemplate: true
  },
  {
    name: "Weight Loss - Day 3: Upper Body Circuit",
    description: "Circuit training targeting upper body with minimal rest",
    goal: "Weight Loss",
    category: "weight_loss",
    durationWeeks: 8,
    difficulty: "intermediate",
    daysPerWeek: 7,
    exercises: [
      { name: "Push-ups", sets: 4, reps: 15, restSeconds: 30, notes: "Modify on knees if needed" },
      { name: "Dumbbell Rows", sets: 4, reps: 12, restSeconds: 30, notes: "Each arm" },
      { name: "Shoulder Press", sets: 4, reps: 12, restSeconds: 30, notes: "Control the weight" },
      { name: "Tricep Dips", sets: 4, reps: 15, restSeconds: 30, notes: "Use chair or bench" },
      { name: "Bicep Curls", sets: 4, reps: 15, restSeconds: 30, notes: "Slow and controlled" },
      { name: "Burpees", sets: 3, reps: 12, restSeconds: 45, notes: "Finish with cardio blast" }
    ],
    isTemplate: true
  },
  {
    name: "Weight Loss - Day 4: Lower Body Power",
    description: "Lower body strength training with high-intensity movements",
    goal: "Weight Loss",
    category: "weight_loss",
    durationWeeks: 8,
    difficulty: "intermediate",
    daysPerWeek: 7,
    exercises: [
      { name: "Squats", sets: 4, reps: 20, restSeconds: 45, notes: "Bodyweight or weighted" },
      { name: "Lunges", sets: 4, reps: 15, restSeconds: 30, notes: "Each leg" },
      { name: "Deadlifts", sets: 4, reps: 12, restSeconds: 45, notes: "Keep back straight" },
      { name: "Jump Squats", sets: 3, reps: 15, restSeconds: 45, notes: "Explosive movement" },
      { name: "Glute Bridges", sets: 4, reps: 20, restSeconds: 30, notes: "Squeeze at top" },
      { name: "Calf Raises", sets: 4, reps: 25, restSeconds: 30, notes: "Full range of motion" }
    ],
    isTemplate: true
  },
  {
    name: "Weight Loss - Day 5: Active Recovery & Stretching",
    description: "Light cardio and stretching to promote recovery and flexibility",
    goal: "Weight Loss",
    category: "weight_loss",
    durationWeeks: 8,
    difficulty: "beginner",
    daysPerWeek: 7,
    exercises: [
      { name: "Brisk Walking", sets: 1, reps: 1, restSeconds: 0, notes: "20 minutes" },
      { name: "Yoga Flow", sets: 1, reps: 1, restSeconds: 0, notes: "15 minutes sun salutations" },
      { name: "Hamstring Stretch", sets: 3, reps: 1, restSeconds: 30, notes: "Hold 30 seconds each leg" },
      { name: "Quad Stretch", sets: 3, reps: 1, restSeconds: 30, notes: "Hold 30 seconds each leg" },
      { name: "Hip Flexor Stretch", sets: 3, reps: 1, restSeconds: 30, notes: "Hold 30 seconds each side" },
      { name: "Shoulder Rolls", sets: 2, reps: 20, restSeconds: 0, notes: "Forward and backward" }
    ],
    isTemplate: true
  },
  {
    name: "Weight Loss - Day 6: Total Body Strength",
    description: "Full body strength training with compound movements",
    goal: "Weight Loss",
    category: "weight_loss",
    durationWeeks: 8,
    difficulty: "intermediate",
    daysPerWeek: 7,
    exercises: [
      { name: "Squat to Press", sets: 4, reps: 12, restSeconds: 45, notes: "Dumbbell or barbell" },
      { name: "Renegade Rows", sets: 3, reps: 10, restSeconds: 45, notes: "Each arm in plank position" },
      { name: "Kettlebell Swings", sets: 4, reps: 20, restSeconds: 45, notes: "Hip hinge movement" },
      { name: "Box Step-ups", sets: 4, reps: 12, restSeconds: 30, notes: "Each leg" },
      { name: "Push-up to T", sets: 3, reps: 10, restSeconds: 45, notes: "Rotate and hold" },
      { name: "Plank Jacks", sets: 3, reps: 20, restSeconds: 30, notes: "Keep hips stable" }
    ],
    isTemplate: true
  },
  {
    name: "Weight Loss - Day 7: HIIT Cardio Blast",
    description: "Maximum calorie burn with high-intensity intervals",
    goal: "Weight Loss",
    category: "weight_loss",
    durationWeeks: 8,
    difficulty: "advanced",
    daysPerWeek: 7,
    exercises: [
      { name: "Sprint Intervals", sets: 10, reps: 1, restSeconds: 60, notes: "30 seconds sprint, 60 seconds walk" },
      { name: "Burpees", sets: 5, reps: 15, restSeconds: 45, notes: "Maximum effort" },
      { name: "Jump Rope", sets: 5, reps: 100, restSeconds: 45, notes: "Or 60 seconds continuous" },
      { name: "Box Jumps", sets: 4, reps: 12, restSeconds: 60, notes: "Explosive power" },
      { name: "Battle Ropes", sets: 4, reps: 1, restSeconds: 45, notes: "30 seconds waves" },
      { name: "Cool Down Jog", sets: 1, reps: 1, restSeconds: 0, notes: "10 minutes easy pace" }
    ],
    isTemplate: true
  },

  // WEIGHT GAIN - 7 Days
  {
    name: "Weight Gain - Day 1: Chest & Triceps",
    description: "Heavy compound movements for chest and tricep development",
    goal: "Weight Gain",
    category: "weight_gain",
    durationWeeks: 8,
    difficulty: "intermediate",
    daysPerWeek: 7,
    exercises: [
      { name: "Barbell Bench Press", sets: 4, reps: 8, restSeconds: 120, notes: "Progressive overload" },
      { name: "Incline Dumbbell Press", sets: 4, reps: 10, restSeconds: 90, notes: "45-degree angle" },
      { name: "Cable Flyes", sets: 3, reps: 12, restSeconds: 60, notes: "Squeeze at contraction" },
      { name: "Dips", sets: 3, reps: 12, restSeconds: 90, notes: "Weighted if possible" },
      { name: "Tricep Pushdowns", sets: 4, reps: 12, restSeconds: 60, notes: "Full extension" },
      { name: "Overhead Tricep Extension", sets: 3, reps: 12, restSeconds: 60, notes: "Dumbbell or cable" }
    ],
    isTemplate: true
  },
  {
    name: "Weight Gain - Day 2: Back & Biceps",
    description: "Heavy pulling movements for back width and thickness",
    goal: "Weight Gain",
    category: "weight_gain",
    durationWeeks: 8,
    difficulty: "intermediate",
    daysPerWeek: 7,
    exercises: [
      { name: "Deadlifts", sets: 4, reps: 6, restSeconds: 150, notes: "Perfect form essential" },
      { name: "Pull-ups", sets: 4, reps: 10, restSeconds: 90, notes: "Weighted if possible" },
      { name: "Barbell Rows", sets: 4, reps: 8, restSeconds: 90, notes: "Pull to lower chest" },
      { name: "Lat Pulldowns", sets: 3, reps: 12, restSeconds: 60, notes: "Wide grip" },
      { name: "Barbell Curls", sets: 4, reps: 10, restSeconds: 60, notes: "No swinging" },
      { name: "Hammer Curls", sets: 3, reps: 12, restSeconds: 60, notes: "Neutral grip" }
    ],
    isTemplate: true
  },
  {
    name: "Weight Gain - Day 3: Shoulders & Abs",
    description: "Complete shoulder development with core work",
    goal: "Weight Gain",
    category: "weight_gain",
    durationWeeks: 8,
    difficulty: "intermediate",
    daysPerWeek: 7,
    exercises: [
      { name: "Military Press", sets: 4, reps: 8, restSeconds: 120, notes: "Standing or seated" },
      { name: "Lateral Raises", sets: 4, reps: 15, restSeconds: 45, notes: "Control the weight" },
      { name: "Front Raises", sets: 3, reps: 12, restSeconds: 45, notes: "Alternate arms" },
      { name: "Reverse Flyes", sets: 3, reps: 15, restSeconds: 45, notes: "Rear delts" },
      { name: "Hanging Leg Raises", sets: 4, reps: 15, restSeconds: 60, notes: "Controlled movement" },
      { name: "Weighted Crunches", sets: 4, reps: 20, restSeconds: 45, notes: "Hold weight on chest" }
    ],
    isTemplate: true
  },
  {
    name: "Weight Gain - Day 4: Legs - Quad Focus",
    description: "Heavy leg day focusing on quadriceps development",
    goal: "Weight Gain",
    category: "weight_gain",
    durationWeeks: 8,
    difficulty: "advanced",
    daysPerWeek: 7,
    exercises: [
      { name: "Barbell Squats", sets: 5, reps: 6, restSeconds: 180, notes: "Deep and controlled" },
      { name: "Leg Press", sets: 4, reps: 12, restSeconds: 90, notes: "Full range of motion" },
      { name: "Bulgarian Split Squats", sets: 3, reps: 10, restSeconds: 60, notes: "Each leg" },
      { name: "Leg Extensions", sets: 4, reps: 15, restSeconds: 45, notes: "Squeeze at top" },
      { name: "Walking Lunges", sets: 3, reps: 20, restSeconds: 60, notes: "Weighted" },
      { name: "Calf Raises", sets: 5, reps: 20, restSeconds: 45, notes: "Standing machine" }
    ],
    isTemplate: true
  },
  {
    name: "Weight Gain - Day 5: Rest & Recovery",
    description: "Active recovery with light stretching and mobility work",
    goal: "Weight Gain",
    category: "weight_gain",
    durationWeeks: 8,
    difficulty: "beginner",
    daysPerWeek: 7,
    exercises: [
      { name: "Light Walking", sets: 1, reps: 1, restSeconds: 0, notes: "20 minutes easy pace" },
      { name: "Foam Rolling", sets: 1, reps: 1, restSeconds: 0, notes: "Full body - 15 minutes" },
      { name: "Dynamic Stretching", sets: 3, reps: 10, restSeconds: 30, notes: "Each major muscle group" },
      { name: "Yoga Flow", sets: 1, reps: 1, restSeconds: 0, notes: "20 minutes gentle flow" },
      { name: "Breathing Exercises", sets: 3, reps: 10, restSeconds: 60, notes: "Deep diaphragmatic breathing" },
      { name: "Meditation", sets: 1, reps: 1, restSeconds: 0, notes: "10 minutes mindfulness" }
    ],
    isTemplate: true
  },
  {
    name: "Weight Gain - Day 6: Chest & Back Combo",
    description: "Superset chest and back for maximum muscle pump",
    goal: "Weight Gain",
    category: "weight_gain",
    durationWeeks: 8,
    difficulty: "advanced",
    daysPerWeek: 7,
    exercises: [
      { name: "Bench Press + Barbell Rows", sets: 4, reps: 10, restSeconds: 90, notes: "Superset - no rest between" },
      { name: "Incline Press + Pull-ups", sets: 4, reps: 10, restSeconds: 90, notes: "Superset" },
      { name: "Cable Flyes + Lat Pulldowns", sets: 3, reps: 12, restSeconds: 60, notes: "Superset" },
      { name: "Dumbbell Pullovers", sets: 3, reps: 15, restSeconds: 60, notes: "Expands rib cage" },
      { name: "Face Pulls", sets: 3, reps: 15, restSeconds: 45, notes: "Upper back and rear delts" },
      { name: "Plank Hold", sets: 3, reps: 1, restSeconds: 60, notes: "60 seconds max hold" }
    ],
    isTemplate: true
  },
  {
    name: "Weight Gain - Day 7: Legs - Hamstring & Glute Focus",
    description: "Posterior chain development for complete leg growth",
    goal: "Weight Gain",
    category: "weight_gain",
    durationWeeks: 8,
    difficulty: "advanced",
    daysPerWeek: 7,
    exercises: [
      { name: "Romanian Deadlifts", sets: 4, reps: 8, restSeconds: 120, notes: "Feel the stretch" },
      { name: "Leg Curls", sets: 4, reps: 12, restSeconds: 60, notes: "Slow negatives" },
      { name: "Hip Thrusts", sets: 4, reps: 12, restSeconds: 90, notes: "Heavy weight, squeeze glutes" },
      { name: "Walking Lunges", sets: 3, reps: 15, restSeconds: 60, notes: "Each leg" },
      { name: "Glute-Ham Raises", sets: 3, reps: 10, restSeconds: 90, notes: "Assisted if needed" },
      { name: "Seated Calf Raises", sets: 4, reps: 20, restSeconds: 45, notes: "Full stretch" }
    ],
    isTemplate: true
  },

  // MAINTAIN WEIGHT - 7 Days
  {
    name: "Maintain Weight - Day 1: Full Body Strength",
    description: "Balanced strength training for muscle maintenance",
    goal: "Maintain Weight",
    category: "maintenance",
    durationWeeks: 8,
    difficulty: "intermediate",
    daysPerWeek: 7,
    exercises: [
      { name: "Squats", sets: 3, reps: 12, restSeconds: 90, notes: "Moderate weight" },
      { name: "Bench Press", sets: 3, reps: 10, restSeconds: 90, notes: "Controlled tempo" },
      { name: "Bent Over Rows", sets: 3, reps: 12, restSeconds: 60, notes: "Squeeze back" },
      { name: "Shoulder Press", sets: 3, reps: 10, restSeconds: 60, notes: "Full range" },
      { name: "Planks", sets: 3, reps: 1, restSeconds: 60, notes: "45-60 seconds hold" },
      { name: "Bicep Curls", sets: 2, reps: 12, restSeconds: 45, notes: "Pump work" }
    ],
    isTemplate: true
  },
  {
    name: "Maintain Weight - Day 2: Cardio & Core",
    description: "Moderate cardio with core strengthening",
    goal: "Maintain Weight",
    category: "maintenance",
    durationWeeks: 8,
    difficulty: "intermediate",
    daysPerWeek: 7,
    exercises: [
      { name: "Jogging", sets: 1, reps: 1, restSeconds: 0, notes: "25 minutes moderate pace" },
      { name: "Crunches", sets: 3, reps: 20, restSeconds: 30, notes: "Controlled movement" },
      { name: "Bicycle Crunches", sets: 3, reps: 20, restSeconds: 30, notes: "Touch elbow to knee" },
      { name: "Side Planks", sets: 3, reps: 1, restSeconds: 45, notes: "30 seconds each side" },
      { name: "Russian Twists", sets: 3, reps: 25, restSeconds: 30, notes: "With or without weight" },
      { name: "Leg Raises", sets: 3, reps: 15, restSeconds: 45, notes: "Lower slowly" }
    ],
    isTemplate: true
  },
  {
    name: "Maintain Weight - Day 3: Upper Body Push",
    description: "Push-focused upper body workout for balanced development",
    goal: "Maintain Weight",
    category: "maintenance",
    durationWeeks: 8,
    difficulty: "intermediate",
    daysPerWeek: 7,
    exercises: [
      { name: "Push-ups", sets: 3, reps: 15, restSeconds: 60, notes: "Various hand positions" },
      { name: "Dumbbell Bench Press", sets: 3, reps: 12, restSeconds: 75, notes: "Flat bench" },
      { name: "Incline Dumbbell Press", sets: 3, reps: 10, restSeconds: 75, notes: "30-degree angle" },
      { name: "Lateral Raises", sets: 3, reps: 15, restSeconds: 45, notes: "Light weight, perfect form" },
      { name: "Tricep Dips", sets: 3, reps: 12, restSeconds: 60, notes: "Bodyweight or weighted" },
      { name: "Overhead Tricep Extension", sets: 2, reps: 12, restSeconds: 45, notes: "Cable or dumbbell" }
    ],
    isTemplate: true
  },
  {
    name: "Maintain Weight - Day 4: Lower Body Balance",
    description: "Balanced lower body workout for functional strength",
    goal: "Maintain Weight",
    category: "maintenance",
    durationWeeks: 8,
    difficulty: "intermediate",
    daysPerWeek: 7,
    exercises: [
      { name: "Goblet Squats", sets: 3, reps: 15, restSeconds: 60, notes: "Hold dumbbell at chest" },
      { name: "Romanian Deadlifts", sets: 3, reps: 12, restSeconds: 75, notes: "Hamstring stretch" },
      { name: "Lunges", sets: 3, reps: 12, restSeconds: 45, notes: "Each leg, walking or static" },
      { name: "Leg Press", sets: 3, reps: 15, restSeconds: 60, notes: "Moderate weight" },
      { name: "Leg Curls", sets: 3, reps: 12, restSeconds: 45, notes: "Control the movement" },
      { name: "Calf Raises", sets: 3, reps: 20, restSeconds: 30, notes: "Standing or seated" }
    ],
    isTemplate: true
  },
  {
    name: "Maintain Weight - Day 5: Active Recovery",
    description: "Light activity and flexibility work for recovery",
    goal: "Maintain Weight",
    category: "maintenance",
    durationWeeks: 8,
    difficulty: "beginner",
    daysPerWeek: 7,
    exercises: [
      { name: "Walking or Light Cycling", sets: 1, reps: 1, restSeconds: 0, notes: "30 minutes easy pace" },
      { name: "Full Body Stretching", sets: 1, reps: 1, restSeconds: 0, notes: "15 minutes all major groups" },
      { name: "Foam Rolling", sets: 1, reps: 1, restSeconds: 0, notes: "10 minutes focus on tight areas" },
      { name: "Yoga Sun Salutations", sets: 3, reps: 5, restSeconds: 0, notes: "Slow and controlled" },
      { name: "Cat-Cow Stretches", sets: 3, reps: 10, restSeconds: 0, notes: "Spinal mobility" },
      { name: "Child's Pose", sets: 3, reps: 1, restSeconds: 0, notes: "Hold 30 seconds" }
    ],
    isTemplate: true
  },
  {
    name: "Maintain Weight - Day 6: Upper Body Pull",
    description: "Pull-focused upper body for back and biceps",
    goal: "Maintain Weight",
    category: "maintenance",
    durationWeeks: 8,
    difficulty: "intermediate",
    daysPerWeek: 7,
    exercises: [
      { name: "Pull-ups or Lat Pulldowns", sets: 3, reps: 10, restSeconds: 75, notes: "Wide grip" },
      { name: "Dumbbell Rows", sets: 3, reps: 12, restSeconds: 60, notes: "Each arm" },
      { name: "Seated Cable Rows", sets: 3, reps: 12, restSeconds: 60, notes: "Squeeze shoulder blades" },
      { name: "Face Pulls", sets: 3, reps: 15, restSeconds: 45, notes: "Rear delts and upper back" },
      { name: "Barbell Curls", sets: 3, reps: 12, restSeconds: 45, notes: "Strict form" },
      { name: "Hammer Curls", sets: 2, reps: 15, restSeconds: 45, notes: "Neutral grip" }
    ],
    isTemplate: true
  },
  {
    name: "Maintain Weight - Day 7: Full Body Circuit",
    description: "Total body circuit for endurance and strength maintenance",
    goal: "Maintain Weight",
    category: "maintenance",
    durationWeeks: 8,
    difficulty: "intermediate",
    daysPerWeek: 7,
    exercises: [
      { name: "Kettlebell Swings", sets: 3, reps: 20, restSeconds: 60, notes: "Hip hinge power" },
      { name: "Box Step-ups", sets: 3, reps: 12, restSeconds: 45, notes: "Each leg" },
      { name: "Push-ups", sets: 3, reps: 15, restSeconds: 45, notes: "Chest to ground" },
      { name: "TRX Rows", sets: 3, reps: 15, restSeconds: 45, notes: "Or inverted rows" },
      { name: "Medicine Ball Slams", sets: 3, reps: 15, restSeconds: 60, notes: "Full body power" },
      { name: "Plank to Downward Dog", sets: 3, reps: 10, restSeconds: 45, notes: "Dynamic core" }
    ],
    isTemplate: true
  }
];

async function seedWorkoutPlans() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Delete existing workout plan templates with these categories
    await WorkoutPlan.deleteMany({
      category: { $in: ["weight_loss", "weight_gain", "maintenance"] },
      isTemplate: true
    });
    console.log('Deleted existing workout plan templates');

    // Insert new workout plans
    const result = await WorkoutPlan.insertMany(workoutPlans);
    console.log(`✅ Successfully created ${result.length} workout plans`);
    
    console.log('\nWorkout Plans by Category:');
    console.log('- Weight Loss: 7 days');
    console.log('- Weight Gain: 7 days');
    console.log('- Maintain Weight: 7 days');
    console.log('\nTotal: 21 comprehensive workout plans');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding workout plans:', error);
    process.exit(1);
  }
}

seedWorkoutPlans();
