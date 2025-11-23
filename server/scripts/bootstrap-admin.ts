import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user';
import { Client } from '../models';
import { hashPassword } from '../utils/auth';

dotenv.config({ override: true });

/**
 * Bootstrap script to create initial admin and test client users
 * 
 * Set these environment variables:
 * - ADMIN_EMAIL: Admin email address
 * - ADMIN_PASSWORD: Admin password
 * - ADMIN_NAME: Admin name
 * - CLIENT_EMAIL: Test client email
 * - CLIENT_PASSWORD: Test client password
 * - CLIENT_NAME: Test client name
 * - CLIENT_PHONE: Test client phone number
 */
async function bootstrapUsers() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not set');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');
    
    // Check if users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log(`⚠️  Database already has ${existingUsers} user(s)`);
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise<string>((resolve) => {
        readline.question('Do you want to delete all existing users and create new ones? (yes/no): ', resolve);
      });
      
      readline.close();
      
      if (answer.toLowerCase() !== 'yes') {
        console.log('Aborting...');
        process.exit(0);
      }
      
      // Delete all existing users
      await User.deleteMany({});
      await Client.deleteMany({});
      console.log('✅ Deleted all existing users and clients\n');
    }
    
    // Create Admin User - require environment variables for security
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME;
    
    if (!adminEmail || !adminPassword || !adminName) {
      console.error('❌ ERROR: Admin credentials must be set via environment variables:');
      console.error('   - ADMIN_EMAIL');
      console.error('   - ADMIN_PASSWORD');
      console.error('   - ADMIN_NAME');
      console.error('\nFor development, you can use these defaults:');
      console.error('   ADMIN_EMAIL=admin@fitpro.com');
      console.error('   ADMIN_PASSWORD=Admin@2024Secure!');
      console.error('   ADMIN_NAME="FitPro Admin"');
      process.exit(1);
    }
    
    console.log('Creating Admin User...');
    const hashedAdminPassword = await hashPassword(adminPassword);
    const adminUser = new User({
      email: adminEmail.toLowerCase(),
      password: hashedAdminPassword,
      role: 'admin',
      name: adminName,
    });
    await adminUser.save();
    console.log(`✅ Admin created: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Role: admin\n`);
    
    // Create Test Client User - require environment variables for security
    const clientEmail = process.env.CLIENT_EMAIL;
    const clientPassword = process.env.CLIENT_PASSWORD;
    const clientName = process.env.CLIENT_NAME;
    const clientPhone = process.env.CLIENT_PHONE;
    
    if (!clientEmail || !clientPassword || !clientName || !clientPhone) {
      console.error('❌ ERROR: Client credentials must be set via environment variables:');
      console.error('   - CLIENT_EMAIL');
      console.error('   - CLIENT_PASSWORD');
      console.error('   - CLIENT_NAME');
      console.error('   - CLIENT_PHONE');
      console.error('\nFor development, you can use these defaults:');
      console.error('   CLIENT_EMAIL=client@test.com');
      console.error('   CLIENT_PASSWORD=Client@2024Test!');
      console.error('   CLIENT_NAME="Test Client"');
      console.error('   CLIENT_PHONE="+1234567890"');
      process.exit(1);
    }
    
    console.log('Creating Test Client...');
    
    // Create client record first
    const client = new Client({
      name: clientName,
      email: clientEmail.toLowerCase(),
      phone: clientPhone,
      status: 'active',
    });
    await client.save();
    
    // Create user record linked to client
    const hashedClientPassword = await hashPassword(clientPassword);
    const clientUser = new User({
      email: clientEmail.toLowerCase(),
      password: hashedClientPassword,
      role: 'client',
      name: clientName,
      phone: clientPhone,
      clientId: client._id,
    });
    await clientUser.save();
    
    console.log(`✅ Client created: ${clientEmail}`);
    console.log(`   Password: ${clientPassword}`);
    console.log(`   Role: client`);
    console.log(`   Client ID: ${client._id}\n`);
    
    console.log('═══════════════════════════════════════════');
    console.log('✅ Bootstrap Complete!');
    console.log('═══════════════════════════════════════════');
    console.log('\n📝 Save these credentials securely:\n');
    console.log('ADMIN CREDENTIALS:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('');
    console.log('CLIENT CREDENTIALS:');
    console.log(`   Email: ${clientEmail}`);
    console.log(`   Password: ${clientPassword}`);
    console.log('═══════════════════════════════════════════\n');
    
    console.log('⚠️  IMPORTANT: Change the default passwords after first login!');
    console.log('💡 TIP: Store these credentials in a password manager.\n');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

bootstrapUsers();
