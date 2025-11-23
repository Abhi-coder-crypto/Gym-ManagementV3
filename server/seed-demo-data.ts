import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcrypt';
import { Package, Trainer, Client, LiveSession, SessionClient } from './models.js';
import { User } from './models/user.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const MONGODB_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitpro';

async function seedDemoData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URL);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Client.deleteMany({});
    await Trainer.deleteMany({});
    await LiveSession.deleteMany({});
    await SessionClient.deleteMany({});
    // Clear trainer users from User collection
    await User.deleteMany({ role: 'trainer', email: { $in: ['rajesh.trainer@fitpro.com', 'priya.trainer@fitpro.com', 'arjun.trainer@fitpro.com'] } });
    console.log('✅ Cleared all existing clients, trainers, and sessions');

    // Get all packages
    const packages = await Package.find({});
    console.log(`📦 Found ${packages.length} packages`);

    // Map packages by name
    const packageMap: any = {};
    packages.forEach(pkg => {
      packageMap[pkg.name] = pkg._id;
    });

    console.log('\n📋 Package IDs:', Object.keys(packageMap).join(', '));

    // CREATE 4 DEMO CLIENTS with their respective packages
    const clientsData = [
      {
        name: 'abhijeet',
        email: 'abhijeet@fitpro.com',
        phone: '9876543210',
        packageName: 'Fit Basics',
        goal: 'weight_loss',
        fitnessLevel: 'beginner',
        age: 28,
        gender: 'male',
        status: 'active',
        packageDuration: 8,
      },
      {
        name: 'aniket',
        email: 'aniket@fitpro.com',
        phone: '9876543211',
        packageName: 'Fit Plus (Main Group Program)',
        goal: 'muscle_gain',
        fitnessLevel: 'intermediate',
        age: 30,
        gender: 'male',
        status: 'active',
        packageDuration: 8,
      },
      {
        name: 'sairaj',
        email: 'sairaj@fitpro.com',
        phone: '9876543212',
        packageName: 'Pro Transformation',
        goal: 'fitness',
        fitnessLevel: 'intermediate',
        age: 32,
        gender: 'male',
        status: 'active',
        packageDuration: 8,
      },
      {
        name: 'sejal',
        email: 'sejal@fitpro.com',
        phone: '9876543213',
        packageName: 'Elite Athlete / Fast Result',
        goal: 'performance',
        fitnessLevel: 'advanced',
        age: 26,
        gender: 'female',
        status: 'active',
        packageDuration: 8,
      },
    ];

    const createdClients: any = [];
    for (const clientData of clientsData) {
      const packageId = packageMap[clientData.packageName];
      if (!packageId) {
        console.error(`❌ Package not found: ${clientData.packageName}`);
        console.error(`Available packages: ${Object.keys(packageMap).join(', ')}`);
        continue;
      }

      // Calculate subscription dates
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + clientData.packageDuration * 7); // weeks to days

      const client = await Client.create({
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        packageId: packageId,
        packageDuration: clientData.packageDuration,
        goal: clientData.goal,
        fitnessLevel: clientData.fitnessLevel,
        age: clientData.age,
        gender: clientData.gender,
        status: clientData.status,
        subscription: {
          startDate,
          endDate,
          renewalType: 'monthly',
          autoRenewal: true,
        },
        notificationPreferences: {
          email: true,
          sessionReminders: true,
          achievements: true,
        },
      });

      createdClients.push({
        name: clientData.name,
        email: clientData.email,
        password: 'Demo@123', // Default password
        package: clientData.packageName,
        id: client._id,
      });

      console.log(`✅ Created client: ${clientData.name} (${clientData.packageName})`);
    }

    // CREATE 3 DEMO TRAINERS
    const trainersData = [
      {
        name: 'Rajesh Kumar',
        email: 'rajesh.trainer@fitpro.com',
        phone: '8765432101',
        specialty: 'Strength Training',
      },
      {
        name: 'Priya Singh',
        email: 'priya.trainer@fitpro.com',
        phone: '8765432102',
        specialty: 'Cardio & HIIT',
      },
      {
        name: 'Arjun Patel',
        email: 'arjun.trainer@fitpro.com',
        phone: '8765432103',
        specialty: 'Functional Training',
      },
    ];

    const createdTrainers: any = [];
    for (const trainerData of trainersData) {
      // Create as User document with role='trainer'
      const hashedPassword = await bcrypt.hash('Demo@123', 10);
      const trainerUser = await User.create({
        email: trainerData.email,
        password: hashedPassword,
        role: 'trainer',
        name: trainerData.name,
        phone: trainerData.phone,
        status: 'active',
      });

      // Also create in Trainer collection for trainer-specific data
      const trainer = await Trainer.create({
        name: trainerData.name,
        email: trainerData.email,
        phone: trainerData.phone,
        specialty: trainerData.specialty,
        bio: `Expert ${trainerData.specialty} trainer with 5+ years experience`,
        experience: 5,
        status: 'active',
        availability: {
          monday: { start: '6:00 AM', end: '10:00 PM' },
          tuesday: { start: '6:00 AM', end: '10:00 PM' },
          wednesday: { start: '6:00 AM', end: '10:00 PM' },
          thursday: { start: '6:00 AM', end: '10:00 PM' },
          friday: { start: '6:00 AM', end: '10:00 PM' },
          saturday: { start: '8:00 AM', end: '8:00 PM' },
          sunday: { start: '8:00 AM', end: '8:00 PM' },
        },
      });

      createdTrainers.push({
        name: trainerData.name,
        email: trainerData.email,
        password: 'Demo@123', // Default password
        specialty: trainerData.specialty,
        userId: trainerUser._id,
        trainerId: trainer._id,
      });

      console.log(`✅ Created trainer: ${trainerData.name}`);
    }

    // CREATE 3 LIVE SESSIONS (only for packages with live session access)
    const sessionsData = [
      {
        title: 'Fit Plus Live Training - Cardio Bootcamp',
        description: 'Dynamic cardio workout for Fit Plus members',
        packageRequirement: 'Fit Plus (Main Group Program)',
        trainerIndex: 1, // Priya Singh (Cardio specialist)
        clientIndices: [1], // aniket (Fit Plus)
        time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      },
      {
        title: 'Pro Transformation Live Session - Strength Focus',
        description: 'Advanced strength training for Pro Transformation members',
        packageRequirement: 'Pro Transformation',
        trainerIndex: 0, // Rajesh Kumar (Strength specialist)
        clientIndices: [2], // sairaj (Pro Transformation)
        time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      },
      {
        title: 'Elite Athlete Live Session - Performance Training',
        description: 'Elite performance optimization for Elite Athlete members',
        packageRequirement: 'Elite Athlete / Fast Result',
        trainerIndex: 2, // Arjun Patel (Functional specialist)
        clientIndices: [3], // sejal (Elite Athlete)
        time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    ];

    const createdSessions: any = [];
    for (const sessionData of sessionsData) {
      const trainer = createdTrainers[sessionData.trainerIndex];
      
      // Generate unique Zoom links
      const zoomLink = `https://zoom.us/j/${Math.random().toString().slice(2, 12)}`;

      const session = await LiveSession.create({
        title: sessionData.title,
        description: sessionData.description,
        sessionType: 'live',
        scheduledAt: sessionData.time,
        duration: 60, // 1 hour
        meetingLink: zoomLink,
        meetingPassword: 'FitPro123',
        trainerId: trainer.trainerId.toString(),
        trainerName: trainer.name,
        maxCapacity: 10,
        currentCapacity: sessionData.clientIndices.length,
        status: 'upcoming',
        isRecurring: false,
      });

      // Assign clients to session
      for (const clientIndex of sessionData.clientIndices) {
        const client = createdClients[clientIndex];
        await SessionClient.create({
          sessionId: session._id,
          clientId: client.id,
          attended: false,
        });
      }

      createdSessions.push({
        title: sessionData.title,
        packageRequirement: sessionData.packageRequirement,
        trainer: trainer.name,
        zoomLink,
        assignedClients: sessionData.clientIndices.map(idx => createdClients[idx].name),
      });

      console.log(`✅ Created session: ${sessionData.title}`);
    }

    console.log('\n' + '='.repeat(80));
    console.log('📋 DEMO DATA CREATED SUCCESSFULLY!\n');

    console.log('👥 CLIENT CREDENTIALS:');
    console.log('-'.repeat(80));
    createdClients.forEach((client: any) => {
      console.log(`\nName: ${client.name}`);
      console.log(`Email: ${client.email}`);
      console.log(`Password: ${client.password}`);
      console.log(`Package: ${client.package}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('👨‍🏫 TRAINER CREDENTIALS:');
    console.log('-'.repeat(80));
    createdTrainers.forEach((trainer: any) => {
      console.log(`\nName: ${trainer.name}`);
      console.log(`Email: ${trainer.email}`);
      console.log(`Password: ${trainer.password}`);
      console.log(`Specialty: ${trainer.specialty}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('🎓 LIVE SESSIONS CREATED:');
    console.log('-'.repeat(80));
    createdSessions.forEach((session: any) => {
      console.log(`\nTitle: ${session.title}`);
      console.log(`Package: ${session.packageRequirement}`);
      console.log(`Trainer: ${session.trainer}`);
      console.log(`Zoom Link: ${session.zoomLink}`);
      console.log(`Assigned Clients: ${session.assignedClients.join(', ')}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('✅ SEEDING COMPLETE!');
    console.log('='.repeat(80) + '\n');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedDemoData();
