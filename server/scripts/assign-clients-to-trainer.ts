import mongoose from 'mongoose';
import { Client, Trainer, User } from '../models';
import dotenv from 'dotenv';

dotenv.config();

async function assignClientsToTrainer() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not set');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');
    
    // Get the trainer profile
    const trainerEmail = "trainer@fitpro.com";
    const trainerProfile = await Trainer.findOne({ email: trainerEmail });
    
    if (!trainerProfile) {
      console.error('❌ Trainer profile not found');
      process.exit(1);
    }
    
    console.log(`✅ Found trainer: ${trainerProfile.name}`);
    console.log(`   Trainer ID: ${trainerProfile._id}\n`);
    
    // Get all clients
    const allClients = await Client.find();
    console.log(`📋 Found ${allClients.length} total clients in database\n`);
    
    if (allClients.length > 0) {
      // Assign all clients to the trainer
      const clientIds = allClients.map(c => c._id);
      trainerProfile.assignedClients = clientIds;
      await trainerProfile.save();
      
      console.log('✅ Assigned clients to trainer:');
      allClients.forEach(client => {
        console.log(`   - ${client.name} (${client.email || client.phone})`);
      });
    } else {
      console.log('⚠️  No clients found in database');
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

assignClientsToTrainer();
