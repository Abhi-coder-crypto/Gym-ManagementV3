import mongoose from 'mongoose';
import { LiveSession } from './models';

export async function migrateLiveSessionReferences() {
  try {
    console.log('🔄 Starting LiveSession schema migration...');
    
    // Use lean() to get raw MongoDB documents without Mongoose casting
    const sessions = await LiveSession.find({}).lean();
    let migratedCount = 0;
    const bulkOps: any[] = [];
    
    for (const session of sessions) {
      let needsUpdate = false;
      const updates: any = {};
      
      // Convert trainerId from string to ObjectId if needed
      if (session.trainerId && typeof session.trainerId === 'string') {
        if (session.trainerId.length === 24 && /^[0-9a-fA-F]{24}$/.test(session.trainerId)) {
          try {
            updates.trainerId = new mongoose.Types.ObjectId(session.trainerId);
            needsUpdate = true;
            console.log(`  ✓ Converting trainerId for: ${session.title}`);
          } catch (e) {
            console.log(`  ⚠️  Could not convert trainerId for session ${session._id}`);
          }
        }
      }
      
      // Convert packageId from string to ObjectId if needed
      if (session.packageId && typeof session.packageId === 'string') {
        if (session.packageId.length === 24 && /^[0-9a-fA-F]{24}$/.test(session.packageId)) {
          try {
            updates.packageId = new mongoose.Types.ObjectId(session.packageId as string);
            needsUpdate = true;
            console.log(`  ✓ Converting packageId for: ${session.title}`);
          } catch (e) {
            console.log(`  ⚠️  Could not convert packageId for session ${session._id}`);
          }
        }
      }
      
      // Initialize clients array if it doesn't exist
      if (!session.clients || !Array.isArray(session.clients)) {
        updates.clients = [];
        needsUpdate = true;
      }
      
      // Add default packagePlan if missing
      if (!session.packagePlan) {
        updates.packagePlan = 'fitplus';
        needsUpdate = true;
        console.log(`  ✓ Adding default packagePlan for: ${session.title}`);
      }
      
      if (needsUpdate) {
        bulkOps.push({
          updateOne: {
            filter: { _id: session._id },
            update: { $set: updates }
          }
        });
        migratedCount++;
      }
    }
    
    // Execute bulk update if there are operations
    if (bulkOps.length > 0) {
      await LiveSession.bulkWrite(bulkOps);
    }
    
    console.log(`✅ LiveSession migration complete. Updated ${migratedCount} of ${sessions.length} sessions.`);
  } catch (error: any) {
    console.error('❌ LiveSession migration failed:', error.message);
  }
}
