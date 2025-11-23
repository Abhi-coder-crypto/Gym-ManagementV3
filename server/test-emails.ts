import dotenv from "dotenv";
dotenv.config({ override: true });

import { storage } from "./storage";
import { emailService } from "./utils/email";

async function testEmails() {
  try {
    await storage.connect();
    console.log("✅ Connected to MongoDB");

    // Get existing clients
    const clients = await storage.getAllClients();
    console.log(`📊 Found ${clients.length} clients`);

    if (clients.length === 0) {
      console.log("❌ No clients found to test emails");
      process.exit(0);
    }

    const testClient = clients[0];
    console.log(`\n🧪 Testing emails for: ${testClient.name} (${testClient.email})\n`);

    // Test 1: Session Reminder Email
    console.log("📧 Test 1: Sending Session Reminder Email...");
    const sessionDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Tomorrow
    const sessionSent = await emailService.sendSessionReminderEmail(
      testClient.email,
      testClient.name,
      "Advanced Strength Training",
      sessionDate,
      testClient._id?.toString()
    );
    console.log(sessionSent ? "✅ Session reminder sent!" : "❌ Session reminder failed");

    // Test 2: Invoice Email
    console.log("\n📧 Test 2: Sending Invoice Email...");
    const invoiceSent = await emailService.sendInvoiceEmail(
      testClient.email,
      testClient.name,
      "INV-2024-001",
      5999,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
      testClient._id?.toString()
    );
    console.log(invoiceSent ? "✅ Invoice email sent!" : "❌ Invoice email failed");

    // Test 3: Welcome Email
    console.log("\n📧 Test 3: Sending Welcome Email...");
    const welcomeSent = await emailService.sendWelcomeEmail(
      testClient.email,
      testClient.name,
      testClient._id?.toString()
    );
    console.log(welcomeSent ? "✅ Welcome email sent!" : "❌ Welcome email failed");

    console.log("\n✨ Email testing completed!");
    console.log("\n📝 Check your Gmail inbox for:");
    console.log("   1. Session Reminder - Advanced Strength Training");
    console.log("   2. Invoice - INV-2024-001");
    console.log("   3. Welcome to FitPro");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error testing emails:", error);
    process.exit(1);
  }
}

testEmails();
