import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user';
import { Client } from '../models';
import { hashPassword } from '../utils/auth';

dotenv.config({ override: true });

async function setupUsers() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not set');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');
    
    // Delete all existing users and clients
    await User.deleteMany({});
    await Client.deleteMany({});
    console.log('✅ Deleted all existing users and clients\n');
    
    // Create Admin User
    console.log('Creating Admin User...');
    const hashedAdminPassword = await hashPassword('Admin@2024Secure!');
    const adminUser = new User({
      email: 'admin@fitpro.com',
      password: hashedAdminPassword,
      role: 'admin',
      name: 'FitPro Admin',
    });
    await adminUser.save();
    console.log('✅ Admin created: admin@fitpro.com');
    console.log('   Password: Admin@2024Secure!');
    console.log('   Role: admin\n');
    
    // Create Abhijeet Singh (Client)
    console.log('Creating Client: Abhijeet Singh...');
    
    // Create client record
    const client = new Client({
      name: 'Abhijeet Singh',
      email: 'Abhijeet@gmail.com',
      phone: '8600126395',
      status: 'active',
      age: 28,
      gender: 'male',
      height: 175,
      weight: 75,
      goal: 'Build Muscle',
    });
    await client.save();
    
    // Create user record linked to client
    const hashedClientPassword = await hashPassword('Abhi@123');
    const clientUser = new User({
      email: 'Abhijeet@gmail.com',
      password: hashedClientPassword,
      role: 'client',
      name: 'Abhijeet Singh',
      phone: '8600126395',
      clientId: client._id,
    });
    await clientUser.save();
    
    console.log('✅ Client created: Abhijeet@gmail.com');
    console.log('   Password: Abhi@123');
    console.log('   Role: client');
    console.log(`   Client ID: ${client._id}\n`);
    
    console.log('═══════════════════════════════════════════');
    console.log('✅ Setup Complete!');
    console.log('═══════════════════════════════════════════');
    console.log('\n📝 Login Credentials:\n');
    console.log('ADMIN:');
    console.log('   Email: admin@fitpro.com');
    console.log('   Password: Admin@2024Secure!');
    console.log('');
    console.log('CLIENT (Abhijeet Singh):');
    console.log('   Email: Abhijeet@gmail.com');
    console.log('   Password: Abhi@123');
    console.log('═══════════════════════════════════════════\n');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupUsers();
