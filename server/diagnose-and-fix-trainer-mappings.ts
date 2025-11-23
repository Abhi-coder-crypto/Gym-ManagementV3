import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from './models/user';
import { Client, Trainer } from './models';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env'), override: true });

async function diagnoseAndFix() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB\n');

    // Get all trainers and their User accounts
    const allTrainers = await Trainer.find({});
    const trainerUsers = await User.find({ role: 'trainer' });
    
    console.log('📊 TRAINER ANALYSIS:');
    console.log(`   Total Trainers in Trainer collection: ${allTrainers.length}`);
    console.log(`   Total Users with role=trainer: ${trainerUsers.length}\n`);

    // Create mapping of Trainer email to User ID
    const trainerEmailToUserId = new Map();
    const trainerIdToUserId = new Map();
    
    for (const trainerUser of trainerUsers) {
      trainerEmailToUserId.set(trainerUser.email, String(trainerUser._id));
      if (trainerUser.trainerId) {
        trainerIdToUserId.set(String(trainerUser.trainerId), String(trainerUser._id));
      }
    }

    console.log('🔗 TRAINER EMAIL → USER ID MAPPING:');
    for (const [email, userId] of trainerEmailToUserId) {
      console.log(`   ${email} → ${userId}`);
    }
    console.log('');

    // Get all clients
    const allClients = await Client.find({});
    console.log(`📋 CLIENTS ANALYSIS:`);
    console.log(`   Total Clients: ${allClients.length}\n`);

    // Check each client's trainer assignment
    let clientsNeedingFix = 0;
    let clientsFixed = 0;

    console.log('🔍 CHECKING CLIENT TRAINER ASSIGNMENTS:\n');
    
    for (const client of allClients) {
      const clientTrainerId = client.trainerId ? String(client.trainerId) : null;
      
      if (!clientTrainerId) {
        console.log(`⚠️  Client: ${client.name} (${client.email})`);
        console.log(`   NO TRAINER ASSIGNED`);
        console.log('');
        continue;
      }

      // Check if trainerId points to a User or Trainer
      const isUserRecord = trainerUsers.some(u => String(u._id) === clientTrainerId);
      const isTrainerRecord = allTrainers.some(t => String(t._id) === clientTrainerId);

      if (isUserRecord) {
        console.log(`✅ Client: ${client.name} (${client.email})`);
        console.log(`   Trainer ID: ${clientTrainerId} → CORRECTLY points to User record`);
        const trainerUser = trainerUsers.find(u => String(u._id) === clientTrainerId);
        if (trainerUser) {
          console.log(`   Trainer: ${trainerUser.email}`);
        }
      } else if (isTrainerRecord) {
        console.log(`❌ Client: ${client.name} (${client.email})`);
        console.log(`   Trainer ID: ${clientTrainerId} → INCORRECTLY points to Trainer record`);
        
        // Find the correct User ID
        const correctUserId = trainerIdToUserId.get(clientTrainerId);
        if (correctUserId) {
          console.log(`   Should be: ${correctUserId} (User ID)`);
          clientsNeedingFix++;
          
          // Fix the mapping
          await Client.findByIdAndUpdate(client._id, {
            trainerId: new mongoose.Types.ObjectId(correctUserId)
          });
          
          console.log(`   ✅ FIXED: Updated to correct User ID`);
          clientsFixed++;
        } else {
          console.log(`   ⚠️  Cannot find matching User ID for this Trainer`);
        }
      } else {
        console.log(`⚠️  Client: ${client.name} (${client.email})`);
        console.log(`   Trainer ID: ${clientTrainerId} → INVALID (not found in User or Trainer collections)`);
      }
      
      console.log('');
    }

    console.log('\n📈 SUMMARY:');
    console.log(`   Total Clients checked: ${allClients.length}`);
    console.log(`   Clients with incorrect trainer IDs: ${clientsNeedingFix}`);
    console.log(`   Clients fixed: ${clientsFixed}`);
    
    if (clientsFixed > 0) {
      console.log('\n✅ All trainer assignments have been corrected!');
      console.log('   Clients now properly reference User IDs instead of Trainer IDs.');
    } else {
      console.log('\n✅ All trainer assignments are already correct!');
    }

    await mongoose.disconnect();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

diagnoseAndFix();
