import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user';
import { hashPassword } from '../utils/auth';

dotenv.config({ override: true });

async function resetClientPasswords() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not set');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');
    
    // Reset Abhijeet's password
    const abhijeetUser = await User.findOne({ email: /^abhijeet@gmail\.com$/i });
    if (abhijeetUser) {
      const abhijeetPassword = 'Abhi@123';
      const hashedPassword = await hashPassword(abhijeetPassword);
      abhijeetUser.password = hashedPassword;
      await abhijeetUser.save();
      
      console.log('✅ Abhijeet Singh password reset');
      console.log(`   Email: ${abhijeetUser.email}`);
      console.log(`   Password: ${abhijeetPassword}\n`);
    } else {
      console.log('❌ Abhijeet user not found\n');
    }
    
    // Reset Pratik's password
    const pratikUser = await User.findOne({ email: /^pk@gmail\.com$/i });
    if (pratikUser) {
      const pratikPassword = 'Pratik@123';
      const hashedPassword = await hashPassword(pratikPassword);
      pratikUser.password = hashedPassword;
      await pratikUser.save();
      
      console.log('✅ Pratik password reset');
      console.log(`   Email: ${pratikUser.email}`);
      console.log(`   Password: ${pratikPassword}\n`);
    } else {
      console.log('❌ Pratik user not found\n');
    }
    
    console.log('═══════════════════════════════════════════');
    console.log('✅ Client Passwords Reset Successfully!');
    console.log('═══════════════════════════════════════════\n');
    
    console.log('📝 Client Login Credentials:\n');
    console.log('Abhijeet Singh:');
    console.log('   Email: abhijeet@gmail.com (or Abhijeet@gmail.com)');
    console.log('   Password: Abhi@123\n');
    console.log('Pratik:');
    console.log('   Email: pk@gmail.com');
    console.log('   Password: Pratik@123\n');
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetClientPasswords();
