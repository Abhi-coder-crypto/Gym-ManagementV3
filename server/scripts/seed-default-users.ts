import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user';
import { Trainer } from '../models';
import { hashPassword } from '../utils/auth';

dotenv.config({ override: true });

async function seedDefaultUsers() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not set');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');
    
    // Admin Account
    const adminEmail = "admin@fitpro.com";
    const adminPassword = "Admin@123";
    
    let adminUser = await User.findOne({ email: adminEmail });
    if (adminUser) {
      // Update existing admin password
      const hashedAdminPassword = await hashPassword(adminPassword);
      adminUser.password = hashedAdminPassword;
      adminUser.role = 'admin';
      await adminUser.save();
      console.log('✅ Admin account updated');
    } else {
      // Create new admin
      const hashedAdminPassword = await hashPassword(adminPassword);
      adminUser = await User.create({
        email: adminEmail,
        password: hashedAdminPassword,
        role: 'admin',
        name: 'FitPro Admin',
      });
      console.log('✅ Admin account created');
    }
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   User ID: ${adminUser._id}\n`);
    
    // Trainer Account
    const trainerEmail = "trainer@fitpro.com";
    const trainerPassword = "Trainer@123";
    
    let trainerUser = await User.findOne({ email: trainerEmail });
    let trainerProfile = await Trainer.findOne({ email: trainerEmail });
    
    // Create trainer profile if doesn't exist
    if (!trainerProfile) {
      trainerProfile = await Trainer.create({
        name: "FitPro Trainer",
        email: trainerEmail,
        phone: "9876543210",
        specialty: "Strength & Conditioning",
        bio: "Professional certified trainer",
        experience: 5,
        status: 'active',
      });
      console.log('✅ Trainer profile created');
    }
    
    if (trainerUser) {
      // Update existing trainer password
      const hashedTrainerPassword = await hashPassword(trainerPassword);
      trainerUser.password = hashedTrainerPassword;
      trainerUser.role = 'trainer';
      trainerUser.trainerId = trainerProfile._id;
      await trainerUser.save();
      console.log('✅ Trainer account updated');
    } else {
      // Create new trainer
      const hashedTrainerPassword = await hashPassword(trainerPassword);
      trainerUser = await User.create({
        email: trainerEmail,
        password: hashedTrainerPassword,
        role: 'trainer',
        name: 'FitPro Trainer',
        phone: '9876543210',
        trainerId: trainerProfile._id,
      });
      console.log('✅ Trainer account created');
    }
    console.log(`   Email: ${trainerEmail}`);
    console.log(`   Password: ${trainerPassword}`);
    console.log(`   User ID: ${trainerUser._id}\n`);
    
    console.log('═══════════════════════════════════════════');
    console.log('✅ Default Users Seeded Successfully!');
    console.log('═══════════════════════════════════════════');
    
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
}

seedDefaultUsers();
