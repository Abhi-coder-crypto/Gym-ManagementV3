import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Client, LiveSession } from './models';
import { User } from './models/user';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

async function cleanupDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Delete all live sessions
    const deletedSessions = await LiveSession.deleteMany({});
    console.log(`✅ Deleted ${deletedSessions.deletedCount} live sessions`);

    // Delete all trainers (users with role 'trainer')
    const deletedTrainers = await User.deleteMany({ role: 'trainer' });
    console.log(`✅ Deleted ${deletedTrainers.deletedCount} trainers`);

    // Find Abhijeet Singh by email
    const abhijeet = await Client.findOne({ email: 'abhijeet18012001@gmail.com' });
    
    if (!abhijeet) {
      console.log('❌ Abhijeet Singh not found in database');
      console.log('Creating Abhijeet Singh...');
      
      // Create Abhijeet if not exists
      const newAbhijeet = await Client.create({
        name: 'Abhijeet Singh',
        email: 'abhijeet18012001@gmail.com',
        phone: '8600126395',
        status: 'active',
        createdAt: new Date(),
      });
      console.log(`✅ Created client: ${newAbhijeet.name}`);
    } else {
      console.log(`✅ Found Abhijeet Singh: ${abhijeet.name} (${abhijeet.email})`);
      
      // Delete all clients EXCEPT Abhijeet Singh
      const deletedClients = await Client.deleteMany({
        _id: { $ne: abhijeet._id }
      });
      console.log(`✅ Deleted ${deletedClients.deletedCount} clients (kept only Abhijeet Singh)`);
      
      // Also delete users associated with deleted clients (except Abhijeet's user account)
      const abhijeetUser = await User.findOne({ email: 'abhijeet18012001@gmail.com' });
      if (abhijeetUser) {
        await User.deleteMany({
          role: 'client',
          _id: { $ne: abhijeetUser._id }
        });
        console.log(`✅ Deleted client user accounts (kept only Abhijeet's)`);
      }
    }

    console.log('\n✅ Database cleanup completed successfully!');
    console.log('\nRemaining data:');
    console.log(`- Clients: ${await Client.countDocuments()}`);
    console.log(`- Trainers: ${await User.countDocuments({ role: 'trainer' })}`);
    console.log(`- Live Sessions: ${await LiveSession.countDocuments()}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

cleanupDatabase();
