import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from './models/user';
import { Trainer } from './models';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env'), override: true });

async function fixTrainerUserLinks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB\n');

    // Get all trainers
    const allTrainers = await Trainer.find({});
    console.log(`📋 Found ${allTrainers.length} trainers in Trainer collection\n`);

    // Get all trainer users
    const trainerUsers = await User.find({ role: 'trainer' });
    console.log(`📋 Found ${trainerUsers.length} users with role=trainer\n`);

    console.log('🔗 Linking Trainer Users to Trainer Records:\n');

    let fixed = 0;
    let alreadyLinked = 0;

    for (const trainer of allTrainers) {
      // Find user by email
      const user = trainerUsers.find(u => u.email === trainer.email);
      
      if (!user) {
        console.log(`⚠️  Trainer ${trainer.email} has no User account`);
        continue;
      }

      if (user.trainerId) {
        console.log(`✅ ${trainer.email}`);
        console.log(`   Already linked: User ID ${user._id} → Trainer ID ${user.trainerId}`);
        alreadyLinked++;
      } else {
        console.log(`❌ ${trainer.email}`);
        console.log(`   Missing link: User ID ${user._id} → Trainer ID ${trainer._id}`);
        
        // Fix the link
        await User.findByIdAndUpdate(user._id, {
          trainerId: trainer._id
        });
        
        console.log(`   ✅ FIXED: Added trainerId ${trainer._id} to User record`);
        fixed++;
      }
      console.log('');
    }

    console.log('\n📈 SUMMARY:');
    console.log(`   Trainer users already linked: ${alreadyLinked}`);
    console.log(`   Trainer users fixed: ${fixed}`);

    if (fixed > 0) {
      console.log('\n✅ All trainer User accounts now properly linked to Trainer records!');
    } else {
      console.log('\n✅ All trainer User accounts were already properly linked!');
    }

    await mongoose.disconnect();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixTrainerUserLinks();
