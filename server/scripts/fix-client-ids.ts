import mongoose from 'mongoose';
import { WorkoutPlan, DietPlan } from '../models';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitpro';

async function fixClientIds() {
  try {
    console.log('🔧 Starting client ID migration...');
    console.log('📡 Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Fix WorkoutPlan clientIds
    console.log('\n📋 Fixing WorkoutPlan documents...');
    const workoutPlans = await WorkoutPlan.find({ clientId: { $type: 'string' } });
    console.log(`Found ${workoutPlans.length} workout plans with string clientIds`);
    
    for (const plan of workoutPlans) {
      try {
        const objectId = new mongoose.Types.ObjectId(plan.clientId as any);
        await WorkoutPlan.updateOne(
          { _id: plan._id },
          { $set: { clientId: objectId } }
        );
        console.log(`✓ Fixed WorkoutPlan: ${plan.name} for client ${objectId}`);
      } catch (err: any) {
        console.error(`✗ Error fixing WorkoutPlan ${plan._id}: ${err.message}`);
      }
    }

    // Fix DietPlan clientIds
    console.log('\n🥗 Fixing DietPlan documents...');
    const dietPlans = await DietPlan.find({ clientId: { $type: 'string' } });
    console.log(`Found ${dietPlans.length} diet plans with string clientIds`);
    
    for (const plan of dietPlans) {
      try {
        const objectId = new mongoose.Types.ObjectId(plan.clientId as any);
        await DietPlan.updateOne(
          { _id: plan._id },
          { $set: { clientId: objectId } }
        );
        console.log(`✓ Fixed DietPlan: ${plan.name} for client ${objectId}`);
      } catch (err: any) {
        console.error(`✗ Error fixing DietPlan ${plan._id}: ${err.message}`);
      }
    }

    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

fixClientIds();
