import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from './models/user';
import { Client, Trainer, Package, LiveSession, WorkoutPlan, DietPlan } from './models';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env'), override: true });

async function testEndpoints() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB\n');

    // Test 1: Get all trainers
    console.log('📋 TEST 1: Get All Trainers');
    const trainers = await Trainer.find({});
    console.log(`   Found ${trainers.length} trainers:`);
    trainers.forEach(t => console.log(`   - ${t.email} (ID: ${t._id})`));
    console.log('');

    // Test 2: Get all trainer Users
    console.log('📋 TEST 2: Get All Trainer User Accounts');
    const trainerUsers = await User.find({ role: 'trainer' });
    console.log(`   Found ${trainerUsers.length} trainer users:`);
    trainerUsers.forEach(u => console.log(`   - ${u.email} (User ID: ${u._id}, Trainer ID: ${u.trainerId})`));
    console.log('');

    // Test 3: Get all clients
    console.log('📋 TEST 3: Get All Clients');
    const clients = await Client.find({}).populate('trainerId').populate('packageId');
    console.log(`   Found ${clients.length} clients:`);
    clients.forEach(c => {
      const trainer = c.trainerId as any;
      const pkg = c.packageId as any;
      console.log(`   - ${c.name} (${c.email})`);
      console.log(`     Trainer: ${trainer ? trainer.email : 'NONE'}`);
      console.log(`     Package: ${pkg ? pkg.name : 'NONE'}`);
    });
    console.log('');

    // Test 4: Get clients for a specific trainer (using User ID)
    if (trainerUsers.length > 0) {
      const firstTrainer = trainerUsers[0];
      console.log(`📋 TEST 4: Get Clients for Trainer: ${firstTrainer.email}`);
      const trainerClients = await Client.find({ 
        trainerId: firstTrainer._id 
      });
      console.log(`   Found ${trainerClients.length} clients assigned to this trainer:`);
      trainerClients.forEach(c => console.log(`   - ${c.name} (${c.email})`));
      console.log('');
    }

    // Test 5: Get sessions for a specific trainer
    if (trainerUsers.length > 0) {
      const firstTrainer = trainerUsers[0];
      console.log(`📋 TEST 5: Get Sessions for Trainer: ${firstTrainer.email}`);
      
      // First check what trainerId values are in LiveSession
      const allSessions = await LiveSession.find({});
      console.log(`   Total sessions in database: ${allSessions.length}`);
      if (allSessions.length > 0) {
        console.log(`   Sample session trainerId values:`);
        allSessions.slice(0, 3).forEach(s => {
          console.log(`     - ${s.trainerId} (type: ${typeof s.trainerId})`);
        });
      }
      
      const trainerSessions = await LiveSession.find({
        $or: [
          { trainerId: String(firstTrainer._id) },
          { trainerId: firstTrainer._id }
        ]
      });
      console.log(`   Found ${trainerSessions.length} sessions assigned to this trainer:`);
      trainerSessions.forEach(s => console.log(`   - ${s.title} (${s.sessionType})`));
      console.log('');
    }

    // Test 6: Get packages
    console.log('📋 TEST 6: Get All Packages');
    const packages = await Package.find({});
    console.log(`   Found ${packages.length} packages:`);
    packages.forEach(p => console.log(`   - ${p.name} ($${p.price})`));
    console.log('');

    // Test 7: Get workout plans
    console.log('📋 TEST 7: Get Workout Plans');
    const workoutPlans = await WorkoutPlan.find({});
    console.log(`   Found ${workoutPlans.length} workout plans:`);
    workoutPlans.forEach(w => console.log(`   - ${w.name} (Client: ${w.clientId || 'Template'})`));
    console.log('');

    // Test 8: Get diet plans
    console.log('📋 TEST 8: Get Diet Plans');
    const dietPlans = await DietPlan.find({});
    console.log(`   Found ${dietPlans.length} diet plans:`);
    dietPlans.forEach(d => console.log(`   - ${d.name} (Client: ${d.clientId || 'Template'})`));
    console.log('');

    // Test 9: Check client package access
    console.log('📋 TEST 9: Client Package Feature Access');
    for (const client of clients) {
      if (client.packageId) {
        const pkg = await Package.findById(client.packageId);
        if (pkg) {
          console.log(`   Client: ${client.name}`);
          console.log(`   Package: ${pkg.name}`);
          console.log(`   Features:`);
          console.log(`     - Video Access: ${pkg.videoAccess ? '✅' : '❌'}`);
          console.log(`     - Live Sessions/Month: ${pkg.liveSessionsPerMonth}`);
          console.log(`     - Diet Plan Access: ${pkg.dietPlanAccess ? '✅' : '❌'}`);
          console.log(`     - Workout Plan Access: ${pkg.workoutPlanAccess ? '✅' : '❌'}`);
          console.log('');
        }
      }
    }

    console.log('\n✅ API Endpoint Testing Complete!');
    console.log('\n📝 SUMMARY:');
    console.log(`   ✅ ${trainers.length} trainers in Trainer collection`);
    console.log(`   ✅ ${trainerUsers.length} trainer user accounts`);
    console.log(`   ✅ ${clients.length} clients`);
    console.log(`   ✅ ${packages.length} packages`);
    console.log(`   ✅ ${workoutPlans.length} workout plans`);
    console.log(`   ✅ ${dietPlans.length} diet plans`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testEndpoints();
