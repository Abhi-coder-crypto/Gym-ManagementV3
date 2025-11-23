import { User } from '../models/user';
import { hashPassword } from '../utils/auth';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ override: true });

async function fixAdminUser() {
  try {
    const mongodbUri = process.env.MONGODB_URI;
    if (!mongodbUri) {
      throw new Error('MONGODB_URI is not set in environment variables');
    }

    await mongoose.connect(mongodbUri);
    console.log('Connected to MongoDB');

    const adminEmail = "admin@fitpro.com";
    const adminPassword = "Admin@123";

    // Delete existing admin user if any
    await User.deleteMany({ email: adminEmail });
    console.log('Deleted existing admin user');

    // Create new admin user
    const hashedPassword = await hashPassword(adminPassword);
    const adminUser = await User.create({
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Admin user created successfully');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('User ID:', adminUser._id);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error fixing admin user:', error);
    process.exit(1);
  }
}

fixAdminUser();
