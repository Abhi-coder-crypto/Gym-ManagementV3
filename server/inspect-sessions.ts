import mongoose from 'mongoose';
import { LiveSession, Trainer } from './models';

export async function inspectLiveSessionData() {
  try {
    console.log('\n🔍 Starting LiveSession data inspection...\n');
    
    // Find all sessions
    const sessions = await LiveSession.find({}).lean();
    
    console.log(`📊 Total sessions found: ${sessions.length}\n`);
    
    // Categorize trainerId values
    const categorized = {
      nullOrUndefined: [] as any[],
      objectId: [] as any[],
      hex24String: [] as any[],
      emailString: [] as any[],
      otherString: [] as any[],
      unknown: [] as any[]
    };
    
    for (const session of sessions) {
      const trainerId = session.trainerId;
      
      if (trainerId === null || trainerId === undefined) {
        categorized.nullOrUndefined.push({
          sessionId: session._id,
          title: session.title,
          trainerId: trainerId
        });
      } else if (trainerId instanceof mongoose.Types.ObjectId) {
        categorized.objectId.push({
          sessionId: session._id,
          title: session.title,
          trainerId: trainerId.toString()
        });
      } else if (typeof trainerId === 'string') {
        // Check if it's a 24-char hex string
        if (trainerId.length === 24 && /^[0-9a-fA-F]{24}$/.test(trainerId)) {
          categorized.hex24String.push({
            sessionId: session._id,
            title: session.title,
            trainerId: trainerId
          });
        }
        // Check if it looks like an email
        else if (trainerId.includes('@')) {
          categorized.emailString.push({
            sessionId: session._id,
            title: session.title,
            trainerId: trainerId
          });
        }
        // Other string format
        else {
          categorized.otherString.push({
            sessionId: session._id,
            title: session.title,
            trainerId: trainerId
          });
        }
      } else {
        categorized.unknown.push({
          sessionId: session._id,
          title: session.title,
          trainerId: trainerId,
          type: typeof trainerId
        });
      }
    }
    
    // Print categorized results
    console.log('📈 TrainerId Format Analysis:\n');
    
    if (categorized.nullOrUndefined.length > 0) {
      console.log(`  ❌ NULL/UNDEFINED: ${categorized.nullOrUndefined.length} sessions`);
      categorized.nullOrUndefined.forEach(s => {
        console.log(`     - ${s.title} (${s.sessionId})`);
      });
      console.log();
    }
    
    if (categorized.objectId.length > 0) {
      console.log(`  ✅ ObjectId: ${categorized.objectId.length} sessions`);
      categorized.objectId.forEach(s => {
        console.log(`     - ${s.title}: ${s.trainerId}`);
      });
      console.log();
    }
    
    if (categorized.hex24String.length > 0) {
      console.log(`  🔄 24-char Hex String: ${categorized.hex24String.length} sessions (can convert)`);
      categorized.hex24String.forEach(s => {
        console.log(`     - ${s.title}: ${s.trainerId}`);
      });
      console.log();
    }
    
    if (categorized.emailString.length > 0) {
      console.log(`  📧 Email String: ${categorized.emailString.length} sessions (need lookup)`);
      categorized.emailString.forEach(s => {
        console.log(`     - ${s.title}: ${s.trainerId}`);
      });
      console.log();
    }
    
    if (categorized.otherString.length > 0) {
      console.log(`  ⚠️  Other String Format: ${categorized.otherString.length} sessions`);
      categorized.otherString.forEach(s => {
        console.log(`     - ${s.title}: ${s.trainerId}`);
      });
      console.log();
    }
    
    if (categorized.unknown.length > 0) {
      console.log(`  ❓ Unknown Format: ${categorized.unknown.length} sessions`);
      categorized.unknown.forEach(s => {
        console.log(`     - ${s.title}: ${s.trainerId} (${s.type})`);
      });
      console.log();
    }
    
    console.log('✅ Inspection complete\n');
    
    return categorized;
  } catch (error: any) {
    console.error('❌ Inspection failed:', error.message);
    throw error;
  }
}
