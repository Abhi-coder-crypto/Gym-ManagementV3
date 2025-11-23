import dotenv from 'dotenv';
dotenv.config({ override: true });
import mongoose from 'mongoose';
import { WorkoutPlan } from './models';

mongoose.connect(process.env.MONGODB_URI!)
  .then(async () => {
    const allPlans = await WorkoutPlan.find({});
    console.log(`Total workout plans in DB: ${allPlans.length}`);
    
    const templates = await WorkoutPlan.find({ isTemplate: true });
    console.log(`Workout plan templates (isTemplate=true): ${templates.length}`);
    
    if (templates.length > 0) {
      console.log('\nTemplates found:');
      templates.forEach((t, i) => {
        console.log(`${i + 1}. ${t.name} (Category: ${t.category}, Difficulty: ${t.difficulty})`);
      });
    }
    
    if (allPlans.length > 0 && templates.length === 0) {
      console.log('\nAll plans (not marked as templates):');
      allPlans.forEach((p, i) => {
        console.log(`${i + 1}. ${p.name} (isTemplate: ${p.isTemplate})`);
      });
    }
    
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
