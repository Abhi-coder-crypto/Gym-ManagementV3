import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { DietPlan, Client } from './models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const MONGODB_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitpro';

async function seedAniketDiet() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('✅ Connected to MongoDB');

    // Find Aniket's client record
    const aniket = await Client.findOne({ email: 'aniket@fitpro.com' });
    if (!aniket) {
      console.error('❌ Client "aniket" not found. Run seed-demo-data.ts first.');
      process.exit(1);
    }

    console.log(`Found client: ${aniket.name} (ID: ${aniket._id})`);

    // Delete existing diet plans for Aniket
    await DietPlan.deleteMany({ clientId: aniket._id });
    console.log('🗑️  Cleared existing diet plans for Aniket');

    // Create meals for weeks 1-4
    const allMeals = [];
    
    for (let week = 1; week <= 4; week++) {
      // Adjust calories slightly for each week (progressive loading)
      const baseCalories = 2200 + (week * 100);
      const caloriesPerMeal = Math.round(baseCalories / 5);
      
      const weekMeals = [
        {
          weekNumber: week,
          time: '7:00 AM',
          type: 'Breakfast',
          name: `Week ${week} - Protein-Rich Breakfast`,
          calories: caloriesPerMeal,
          protein: Math.round(caloriesPerMeal * 0.35 / 4),
          carbs: Math.round(caloriesPerMeal * 0.40 / 4),
          fats: Math.round(caloriesPerMeal * 0.25 / 9),
        },
        {
          weekNumber: week,
          time: '10:30 AM',
          type: 'Mid-Morning Snack',
          name: `Week ${week} - Energy Boost Snack`,
          calories: caloriesPerMeal,
          protein: Math.round(caloriesPerMeal * 0.30 / 4),
          carbs: Math.round(caloriesPerMeal * 0.45 / 4),
          fats: Math.round(caloriesPerMeal * 0.25 / 9),
        },
        {
          weekNumber: week,
          time: '1:00 PM',
          type: 'Lunch',
          name: `Week ${week} - Balanced Power Lunch`,
          calories: caloriesPerMeal,
          protein: Math.round(caloriesPerMeal * 0.35 / 4),
          carbs: Math.round(caloriesPerMeal * 0.40 / 4),
          fats: Math.round(caloriesPerMeal * 0.25 / 9),
        },
        {
          weekNumber: week,
          time: '4:00 PM',
          type: 'Afternoon Snack',
          name: `Week ${week} - Pre-Workout Fuel`,
          calories: caloriesPerMeal,
          protein: Math.round(caloriesPerMeal * 0.30 / 4),
          carbs: Math.round(caloriesPerMeal * 0.50 / 4),
          fats: Math.round(caloriesPerMeal * 0.20 / 9),
        },
        {
          weekNumber: week,
          time: '7:30 PM',
          type: 'Dinner',
          name: `Week ${week} - Muscle Building Dinner`,
          calories: caloriesPerMeal,
          protein: Math.round(caloriesPerMeal * 0.40 / 4),
          carbs: Math.round(caloriesPerMeal * 0.35 / 4),
          fats: Math.round(caloriesPerMeal * 0.25 / 9),
        },
      ];
      
      allMeals.push(...weekMeals);
    }

    // Create the diet plan
    const dietPlan = await DietPlan.create({
      clientId: aniket._id,
      name: 'Muscle Gain Progressive Plan - 4 Weeks',
      description: 'Progressive 4-week muscle gain diet plan with increasing calories',
      category: 'High Protein',
      targetCalories: 2500,
      protein: 200,
      carbs: 280,
      fats: 70,
      meals: allMeals,
      mealsPerDay: 5,
      waterIntakeGoal: 12,
      supplements: [
        { name: 'Whey Protein', dosage: '30g', timing: 'Post-workout' },
        { name: 'Creatine', dosage: '5g', timing: 'Morning' },
        { name: 'Multivitamin', dosage: '1 tablet', timing: 'Breakfast' },
      ],
      isTemplate: false,
    });

    console.log('\n✅ Created diet plan for Aniket');
    console.log(`   Plan ID: ${dietPlan._id}`);
    console.log(`   Total meals: ${allMeals.length}`);
    console.log(`   Weeks: 1-4`);
    console.log(`   Meals per week: 5`);
    
    console.log('\n📊 Meal Distribution:');
    for (let week = 1; week <= 4; week++) {
      const weekMealsCount = allMeals.filter(m => m.weekNumber === week).length;
      const weekCalories = allMeals
        .filter(m => m.weekNumber === week)
        .reduce((sum, m) => sum + m.calories, 0);
      console.log(`   Week ${week}: ${weekMealsCount} meals, ~${weekCalories} cal/day`);
    }

    console.log('\n✅ Aniket can now view diet plan with Week 4 data!');
    console.log('\nLogin credentials:');
    console.log('  Email: aniket@fitpro.com');
    console.log('  Password: Demo@123');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

seedAniketDiet();
