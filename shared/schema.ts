import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const packages = pgTable("packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  features: text("features").array().notNull(),
  videoAccess: boolean("video_access").notNull().default(false),
  liveSessionsPerMonth: integer("live_sessions_per_month").notNull().default(0),
  dietPlanAccess: boolean("diet_plan_access").notNull().default(false),
  workoutPlanAccess: boolean("workout_plan_access").notNull().default(false),
});

export const insertPackageSchema = createInsertSchema(packages).omit({ id: true });
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packages.$inferSelect;

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  packageId: varchar("package_id").references(() => packages.id),
  accessDurationWeeks: integer("access_duration_weeks").default(4), // 4, 8, or 12 weeks
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  age: integer("age"),
  gender: text("gender"),
  height: decimal("height", { precision: 5, scale: 2 }),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  goal: text("goal"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertClientSchema = createInsertSchema(clients).omit({ id: true, createdAt: true });
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

export const bodyMetrics = pgTable("body_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  weight: decimal("weight", { precision: 5, scale: 2 }).notNull(),
  height: decimal("height", { precision: 5, scale: 2 }).notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  bmi: decimal("bmi", { precision: 5, scale: 2 }),
  bmr: decimal("bmr", { precision: 7, scale: 2 }),
  tdee: decimal("tdee", { precision: 7, scale: 2 }),
  idealWeight: decimal("ideal_weight", { precision: 5, scale: 2 }),
  targetCalories: decimal("target_calories", { precision: 7, scale: 2 }),
  activityLevel: text("activity_level").notNull(),
  goal: text("goal").notNull(),
  recordedAt: timestamp("recorded_at").notNull().default(sql`now()`),
});

export const insertBodyMetricsSchema = createInsertSchema(bodyMetrics).omit({ id: true, recordedAt: true });
export type InsertBodyMetrics = z.infer<typeof insertBodyMetricsSchema>;
export type BodyMetrics = typeof bodyMetrics.$inferSelect;

export const videos = pgTable("videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  thumbnail: text("thumbnail"),
  category: text("category").notNull(),
  duration: integer("duration"),
  packageRequirement: varchar("package_requirement").references(() => packages.id),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertVideoSchema = createInsertSchema(videos).omit({ id: true, createdAt: true });
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;

export const clientVideos = pgTable("client_videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  videoId: varchar("video_id").notNull().references(() => videos.id),
  assignedAt: timestamp("assigned_at").notNull().default(sql`now()`),
});

export const insertClientVideoSchema = createInsertSchema(clientVideos).omit({ id: true, assignedAt: true });
export type InsertClientVideo = z.infer<typeof insertClientVideoSchema>;
export type ClientVideo = typeof clientVideos.$inferSelect;

export const workoutPlans = pgTable("workout_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  name: text("name").notNull(),
  description: text("description"),
  goal: text("goal"),
  durationWeeks: integer("duration_weeks").notNull(),
  exercises: jsonb("exercises").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertWorkoutPlanSchema = createInsertSchema(workoutPlans).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertWorkoutPlan = z.infer<typeof insertWorkoutPlanSchema>;
export type WorkoutPlan = typeof workoutPlans.$inferSelect;

export const dietPlans = pgTable("diet_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  name: text("name").notNull(),
  targetCalories: decimal("target_calories", { precision: 7, scale: 2 }).notNull(),
  protein: decimal("protein", { precision: 5, scale: 2 }),
  carbs: decimal("carbs", { precision: 5, scale: 2 }),
  fats: decimal("fats", { precision: 5, scale: 2 }),
  meals: jsonb("meals").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertDietPlanSchema = createInsertSchema(dietPlans).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertDietPlan = z.infer<typeof insertDietPlanSchema>;
export type DietPlan = typeof dietPlans.$inferSelect;

export const liveSessions = pgTable("live_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  sessionType: text("session_type").notNull(), // Power Yoga, HIIT, Cardio Bootcamp, Strength Building, Flexibility
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").notNull(), // in minutes
  meetingLink: text("meeting_link"),
  trainerName: text("trainer_name"), // Trainer assigned to lead session
  maxCapacity: integer("max_capacity").notNull().default(15),
  currentCapacity: integer("current_capacity").notNull().default(0),
  status: text("status").notNull().default('upcoming'), // upcoming, live, completed, cancelled
  isRecurring: boolean("is_recurring").notNull().default(false),
  recurringPattern: text("recurring_pattern"), // weekly, biweekly - stored as JSON string
  recurringDays: text("recurring_days").array(), // ['monday', 'wednesday', 'friday']
  recurringEndDate: timestamp("recurring_end_date"),
  parentSessionId: varchar("parent_session_id"), // Reference to parent if part of recurring series
  packageId: varchar("package_id").references(() => packages.id), // Package batch this session is for
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertLiveSessionSchema = createInsertSchema(liveSessions).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLiveSession = z.infer<typeof insertLiveSessionSchema>;
export type LiveSession = typeof liveSessions.$inferSelect;

export const sessionClients = pgTable("session_clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => liveSessions.id),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  attended: boolean("attended").default(false),
  bookedAt: timestamp("booked_at").notNull().default(sql`now()`),
});

export const insertSessionClientSchema = createInsertSchema(sessionClients).omit({ id: true, bookedAt: true });
export type InsertSessionClient = z.infer<typeof insertSessionClientSchema>;
export type SessionClient = typeof sessionClients.$inferSelect;

export const sessionWaitlist = pgTable("session_waitlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => liveSessions.id),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  position: integer("position").notNull(), // Position in waitlist queue
  addedAt: timestamp("added_at").notNull().default(sql`now()`),
});

export const insertSessionWaitlistSchema = createInsertSchema(sessionWaitlist).omit({ id: true, addedAt: true });
export type InsertSessionWaitlist = z.infer<typeof insertSessionWaitlistSchema>;
export type SessionWaitlist = typeof sessionWaitlist.$inferSelect;

export const weightTracking = pgTable("weight_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  weight: decimal("weight", { precision: 5, scale: 2 }).notNull(),
  date: timestamp("date").notNull().default(sql`now()`),
});

export const insertWeightTrackingSchema = createInsertSchema(weightTracking).omit({ id: true });
export type InsertWeightTracking = z.infer<typeof insertWeightTrackingSchema>;
export type WeightTracking = typeof weightTracking.$inferSelect;

export const bodyMeasurements = pgTable("body_measurements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  chest: decimal("chest", { precision: 5, scale: 2 }),
  waist: decimal("waist", { precision: 5, scale: 2 }),
  hips: decimal("hips", { precision: 5, scale: 2 }),
  leftArm: decimal("left_arm", { precision: 5, scale: 2 }),
  rightArm: decimal("right_arm", { precision: 5, scale: 2 }),
  leftThigh: decimal("left_thigh", { precision: 5, scale: 2 }),
  rightThigh: decimal("right_thigh", { precision: 5, scale: 2 }),
  neck: decimal("neck", { precision: 5, scale: 2 }),
  shoulders: decimal("shoulders", { precision: 5, scale: 2 }),
  date: timestamp("date").notNull().default(sql`now()`),
});

export const insertBodyMeasurementsSchema = createInsertSchema(bodyMeasurements).omit({ id: true });
export type InsertBodyMeasurements = z.infer<typeof insertBodyMeasurementsSchema>;
export type BodyMeasurements = typeof bodyMeasurements.$inferSelect;

export const personalRecords = pgTable("personal_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  category: text("category").notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull().default(sql`now()`),
});

export const insertPersonalRecordSchema = createInsertSchema(personalRecords).omit({ id: true });
export type InsertPersonalRecord = z.infer<typeof insertPersonalRecordSchema>;
export type PersonalRecord = typeof personalRecords.$inferSelect;

export const weeklyWorkoutGoals = pgTable("weekly_workout_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  plannedWorkouts: integer("planned_workouts").notNull().default(5),
  weekStartDate: timestamp("week_start_date").notNull(),
});

export const insertWeeklyWorkoutGoalSchema = createInsertSchema(weeklyWorkoutGoals).omit({ id: true });
export type InsertWeeklyWorkoutGoal = z.infer<typeof insertWeeklyWorkoutGoalSchema>;
export type WeeklyWorkoutGoal = typeof weeklyWorkoutGoals.$inferSelect;

export const videoViews = pgTable("video_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  videoId: varchar("video_id").notNull().references(() => videos.id),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  viewedAt: timestamp("viewed_at").notNull().default(sql`now()`),
  watchDuration: integer("watch_duration"),
  completed: boolean("completed").default(false),
});

export const insertVideoViewSchema = createInsertSchema(videoViews).omit({ id: true, viewedAt: true });
export type InsertVideoView = z.infer<typeof insertVideoViewSchema>;
export type VideoView = typeof videoViews.$inferSelect;

export const clientActivity = pgTable("client_activity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  activityType: text("activity_type").notNull(),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
  metadata: jsonb("metadata"),
});

export const insertClientActivitySchema = createInsertSchema(clientActivity).omit({ id: true, timestamp: true });
export type InsertClientActivity = z.infer<typeof insertClientActivitySchema>;
export type ClientActivity = typeof clientActivity.$inferSelect;

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  packageId: varchar("package_id").notNull().references(() => packages.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default('pending'),
  paidAt: timestamp("paid_at"),
  dueDate: timestamp("due_date").notNull(),
  invoiceNumber: text("invoice_number"),
  paymentMethod: text("payment_method"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, createdAt: true });
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
