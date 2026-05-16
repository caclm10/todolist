import { migrate } from "drizzle-orm/libsql/migrator";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const runMigration = async () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("❌ DATABASE_URL is not set");
    process.exit(1);
  }

  console.log("⏳ Connecting to database...");
  const client = createClient({ url });
  const db = drizzle(client);

  console.log("⏳ Running migrations from ./db/migrations ...");

  try {
    await migrate(db, { migrationsFolder: "./db/migrations" });
    console.log("✅ Migrations completed!");
  } catch (error) {
    console.error("❌ Migration failed:");
    console.error(error);
    process.exit(1);
  } finally {
    if (client.close) {
      client.close();
    }
  }
};

runMigration();
