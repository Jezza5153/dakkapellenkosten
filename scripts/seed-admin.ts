/**
 * Seed Admin User — Run once to create the initial admin account
 * Usage: npx dotenv -e .env.local -- npx tsx scripts/seed-admin.ts
 */

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { hash } from "bcryptjs";
import * as schema from "../src/db/schema";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

async function main() {
    const email = "jeremy@dakkapellenkosten.nl";
    const password = "DakAdmin2026!";
    const name = "Jeremy";

    console.log(`Creating admin user: ${email}`);

    const passwordHash = await hash(password, 12);

    await db.insert(schema.users).values({
        email,
        passwordHash,
        name,
        role: "admin",
        emailVerified: new Date(),
    }).onConflictDoNothing();

    console.log("✅ Admin user created!");
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Login at: https://dakkapellenkosten.vercel.app/login`);
    console.log(`   Admin:    https://dakkapellenkosten.vercel.app/admin`);
}

main().catch(console.error);
