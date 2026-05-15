import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema: {
            user: schema.User,
            session: schema.Session,
            account: schema.Account,
            verification: schema.Verification,
        }
    }),
    emailAndPassword: {
        enabled: true
    }
});
