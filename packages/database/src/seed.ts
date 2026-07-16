import { db, eq } from "./index";
import { user } from "./schema/auth";
import { account } from "./schema/user";
import { pond, environmentLog, feedingLog, harvestLog } from "./schema/aquaculture";

async function main() {
  console.log("⏳ Seeding database...");

  // 1. Ensure test user exists
  const testUserId = "test-user-id-123";
  const testEmail = "miftasigma11@gmail.com";

  // Check if auth user exists
  let [existingAuthUser] = await db.select().from(user).where(eq(user.id, testUserId));
  if (!existingAuthUser) {
    [existingAuthUser] = await db
      .insert(user)
      .values({
        id: testUserId,
        name: "Mifta",
        email: testEmail,
        emailVerified: true,
      })
      .returning();
    console.log("✅ Inserted auth user");
  }

  // Check if user account exists
  let [existingAccount] = await db.select().from(account).where(eq(account.userId, testUserId));
  if (!existingAccount) {
    [existingAccount] = await db
      .insert(account)
      .values({
        userId: testUserId,
        slackId: "U-123456",
        displayName: "Mifta",
        avatar: "",
        email: testEmail,
        shards: 100,
        permissions: ["admin"],
      })
      .returning();
    console.log("✅ Inserted user account");
  }

  const userId = existingAccount.id;

  // 2. Clear old aquaculture data
  await db.delete(environmentLog);
  await db.delete(feedingLog);
  await db.delete(harvestLog);
  await db.delete(pond);
  console.log("🧹 Cleared old aquaculture logs");

  // 3. Seed Ponds
  const [pondA, pondB, pondC] = await db
    .insert(pond)
    .values([
      { name: "Pond A", userId },
      { name: "Pond B", userId },
      { name: "Pond C", userId },
    ])
    .returning();
  console.log("✅ Inserted ponds");

  // 4. Seed Environment Logs (30 days of data)
  const envLogs = [];
  const startOffset = 30 * 24 * 60 * 60 * 1000; // 30 days
  const nowTime = Date.now();

  const pondList = [pondA, pondB, pondC];
  for (const p of pondList) {
    // Generate readings every 4 hours
    for (let offset = startOffset; offset >= 0; offset -= 4 * 60 * 60 * 1000) {
      const timestamp = new Date(nowTime - offset);
      
      // DO ranges around 5.5 - 7.5
      const dissolvedOxygen = 5.5 + Math.random() * 2;
      // pH ranges around 6.8 - 7.8
      const pH = 6.8 + Math.random() * 1.0;
      // waterLevel ranges around 1.1 - 1.4m
      const waterLevel = 1.1 + Math.random() * 0.3;
      // temperature ranges around 26.5 - 30.5
      const temperature = 26.5 + Math.random() * 4;

      // pH or DO alert condition
      const phAlert = pH < 6.5 || pH > 8.5;
      const doAlert = dissolvedOxygen < 5.0;
      const hasAlert = phAlert || doAlert;

      envLogs.push({
        pondId: p.id,
        dissolvedOxygen: Math.round(dissolvedOxygen * 10) / 10,
        pH: Math.round(pH * 10) / 10,
        waterLevel: Math.round(waterLevel * 100) / 100,
        temperature: Math.round(temperature * 10) / 10,
        hasAlert,
        timestamp,
      });
    }
  }

  // Batch insert environment logs
  await db.insert(environmentLog).values(envLogs);
  console.log(`✅ Inserted ${envLogs.length} environment readings`);

  // 5. Seed Feeding Logs (15 days of data)
  const feedLogs = [];
  for (const p of pondList) {
    // Generate feed events twice a day for the last 15 days
    for (let offset = 15 * 24 * 60 * 60 * 1000; offset >= 0; offset -= 12 * 60 * 60 * 1000) {
      const timestamp = new Date(nowTime - offset);
      const isMorning = timestamp.getHours() < 12;
      const feedType = isMorning ? "Hi-Pro-Vite 781-2" : "PF-1000";
      const amountKg = 30 + Math.random() * 20; // 30 - 50 kg

      feedLogs.push({
        pondId: p.id,
        feedType,
        amountKg: Math.round(amountKg * 10) / 10,
        timestamp,
      });
    }
  }
  await db.insert(feedingLog).values(feedLogs);
  console.log(`✅ Inserted ${feedLogs.length} feeding logs`);

  // 6. Seed Harvest Logs (past logs over 3 months)
  const harvestRecords = [];
  for (let i = 1; i <= 3; i++) {
    const timestamp = new Date(nowTime - i * 30 * 24 * 60 * 60 * 1000);
    // Pond A harvest
    harvestRecords.push({
      pondId: pondA.id,
      species: "Clarias gariepinus",
      estimatedBiomassKg: 1000 + i * 100,
      actualYieldKg: 950 + i * 100 + Math.random() * 50,
      timestamp,
    });
    // Pond B harvest
    harvestRecords.push({
      pondId: pondB.id,
      species: "Clarias gariepinus",
      estimatedBiomassKg: 800 + i * 80,
      actualYieldKg: 780 + i * 80 + Math.random() * 40,
      timestamp,
    });
  }
  await db.insert(harvestLog).values(harvestRecords);
  console.log(`✅ Inserted ${harvestRecords.length} harvest logs`);

  console.log("🎉 Database seeding complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
