import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user';
import { Client } from '../models';
import { hashPassword } from '../utils/auth';

dotenv.config({ override: true });

async function createClientUsers() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not set');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');
    
    // Get all clients
    const clients = await Client.find({});
    console.log(`Found ${clients.length} clients in database\n`);
    
    for (const client of clients) {
      const clientEmail = client.email?.toLowerCase();
      
      if (!clientEmail) {
        console.log(`⚠️  Client ${client.name} has no email, skipping...`);
        continue;
      }
      
      // Check if user already exists
      let user = await User.findOne({ email: clientEmail });
      
      if (user) {
        console.log(`✓ User already exists for ${client.name} (${clientEmail})`);
      } else {
        // Create user account
        // Default password based on client name
        let password = 'Client@123'; // Default password
        
        // Specific passwords for known clients
        if (client.name === 'Abhijeet Singh') {
          password = 'Abhi@123';
        } else if (client.name === 'Pratik') {
          password = 'Pratik@123';
        }
        
        const hashedPassword = await hashPassword(password);
        
        user = await User.create({
          email: clientEmail,
          password: hashedPassword,
          role: 'client',
          name: client.name,
          phone: client.phone || '',
          clientId: client._id,
        });
        
        console.log(`✅ Created user account for ${client.name}`);
        console.log(`   Email: ${clientEmail}`);
        console.log(`   Password: ${password}`);
        console.log(`   User ID: ${user._id}\n`);
      }
    }
    
    console.log('═══════════════════════════════════════════');
    console.log('✅ Client User Accounts Created!');
    console.log('═══════════════════════════════════════════\n');
    
    // Show all client login credentials
    console.log('📝 Client Login Credentials:\n');
    const allUsers = await User.find({ role: 'client' }).populate('clientId');
    for (const user of allUsers) {
      console.log(`${user.name}:`);
      console.log(`   Email: ${user.email}`);
      console.log(`   (Use the password you set)\n`);
    }
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error creating client users:', error);
    process.exit(1);
  }
}

createClientUsers();
