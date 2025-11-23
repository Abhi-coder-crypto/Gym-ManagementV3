import { storage } from './storage';

async function seedPackages() {
  try {
    const existingPackages = await storage.getAllPackages();
    
    if (existingPackages.length > 0) {
      console.log('Packages already exist, skipping seed');
      return;
    }

    const packages = [
      {
        name: "Fit Basics",
        description: "Diet + Workout + Recorded Sessions Access",
        price: 2500,
        features: ["Diet plans", "Workout plans", "Recorded sessions access"],
        dietPlanAccess: true,
        workoutPlanAccess: true,
        recordedSessionsAccess: true,
        videoAccess: true,
        liveSessionsPerMonth: 0,
        personalizedDietAccess: false,
        weeklyCheckInAccess: false,
        liveGroupTrainingAccess: false,
        oneOnOneCallAccess: false,
        habitCoachingAccess: false,
        performanceTrackingAccess: false,
        prioritySupportAccess: false,
      },
      {
        name: "Fit Plus (Main Group Program)",
        description: "Live Group Training + Personalized Diet + Weekly Check-in",
        price: 5000,
        features: ["Live group training", "Personalized diet", "Weekly check-ins", "Workout plans"],
        dietPlanAccess: true,
        workoutPlanAccess: true,
        recordedSessionsAccess: true,
        videoAccess: true,
        liveSessionsPerMonth: 4,
        personalizedDietAccess: true,
        weeklyCheckInAccess: true,
        liveGroupTrainingAccess: true,
        oneOnOneCallAccess: false,
        habitCoachingAccess: false,
        performanceTrackingAccess: false,
        prioritySupportAccess: false,
      },
      {
        name: "Pro Transformation",
        description: "Fit Plus + Weekly 1:1 Call + Habit Coaching",
        price: 7500,
        features: ["Live group training", "Personalized diet", "Weekly check-ins", "Weekly 1:1 calls", "Habit coaching", "Workout plans"],
        dietPlanAccess: true,
        workoutPlanAccess: true,
        recordedSessionsAccess: true,
        videoAccess: true,
        liveSessionsPerMonth: 4,
        personalizedDietAccess: true,
        weeklyCheckInAccess: true,
        liveGroupTrainingAccess: true,
        oneOnOneCallAccess: true,
        habitCoachingAccess: true,
        performanceTrackingAccess: false,
        prioritySupportAccess: false,
      },
      {
        name: "Elite Athlete / Fast Result",
        description: "Pro Transformation + Performance Tracking + Priority Support",
        price: 10000,
        features: ["Live group training", "Personalized diet", "Weekly check-ins", "Weekly 1:1 calls", "Habit coaching", "Performance tracking", "Priority support", "Workout plans"],
        dietPlanAccess: true,
        workoutPlanAccess: true,
        recordedSessionsAccess: true,
        videoAccess: true,
        liveSessionsPerMonth: 8,
        personalizedDietAccess: true,
        weeklyCheckInAccess: true,
        liveGroupTrainingAccess: true,
        oneOnOneCallAccess: true,
        habitCoachingAccess: true,
        performanceTrackingAccess: true,
        prioritySupportAccess: true,
      },
    ];

    for (const pkg of packages) {
      await storage.createPackage(pkg);
      console.log(`Created package: ${pkg.name}`);
    }

    console.log('All packages seeded successfully!');
  } catch (error) {
    console.error('Error seeding packages:', error);
    process.exit(1);
  }
}

export { seedPackages };
