import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { hashPassword } from './utils/auth';
import { User } from './models/user';
import { Client, Trainer } from './models';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root .env file
dotenv.config({ path: path.join(__dirname, '../.env'), override: true });

async function createUserAccounts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB\n');

    // Get all existing users, clients, and trainers
    const existingUsers = await User.find({}, { email: 1 });
    const existingUserEmails = new Set(existingUsers.map(u => u.email));
    
    const allClients = await Client.find({});
    const allTrainers = await Trainer.find({});

    console.log('📊 Current Database Status:');
    console.log(`   - Existing User accounts: ${existingUsers.length}`);
    console.log(`   - Total Clients: ${allClients.length}`);
    console.log(`   - Total Trainers: ${allTrainers.length}\n`);

    // Create User accounts for clients
    console.log('👥 Creating User accounts for Clients...');
    let clientUsersCreated = 0;
    
    for (const client of allClients) {
      if (!existingUserEmails.has(client.email)) {
        // Generate password: Demo@123
        const hashedPassword = await hashPassword('Demo@123');
        
        const newUser = new User({
          email: client.email,
          password: hashedPassword,
          role: 'client',
          clientId: client._id,
          createdAt: new Date(),
        });
        
        await newUser.save();
        console.log(`   ✅ Created user account for client: ${client.email} (${client.name})`);
        clientUsersCreated++;
      } else {
        console.log(`   ⏭️  User account already exists for: ${client.email}`);
      }
    }

    // Create User accounts for trainers
    console.log('\n🏋️  Creating User accounts for Trainers...');
    let trainerUsersCreated = 0;
    
    for (const trainer of allTrainers) {
      if (!existingUserEmails.has(trainer.email)) {
        // Generate password: Trainer@123
        const hashedPassword = await hashPassword('Trainer@123');
        
        const newUser = new User({
          email: trainer.email,
          password: hashedPassword,
          role: 'trainer',
          trainerId: trainer._id,
          createdAt: new Date(),
        });
        
        await newUser.save();
        console.log(`   ✅ Created user account for trainer: ${trainer.email} (${trainer.firstName} ${trainer.lastName})`);
        trainerUsersCreated++;
      } else {
        console.log(`   ⏭️  User account already exists for: ${trainer.email}`);
      }
    }

    console.log('\n📈 Summary:');
    console.log(`   - Client user accounts created: ${clientUsersCreated}`);
    console.log(`   - Trainer user accounts created: ${trainerUsersCreated}`);
    console.log(`   - Total new user accounts: ${clientUsersCreated + trainerUsersCreated}`);

    console.log('\n🔑 Login Credentials:');
    console.log('   Clients: Use their email with password "Demo@123"');
    console.log('   Trainers: Use their email with password "Trainer@123"');
    console.log('   Admin: admin@fitpro.com / Admin@123');

    await mongoose.disconnect();
    console.log('\n✅ Done! All user accounts created successfully.');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createUserAccounts();
