import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Lazy-initialized database connection.
 * Avoids crashing at build time when DATABASE_URL is not set.
 */
let _db: NeonHttpDatabase<typeof schema> | null = null;

function getDb(): NeonHttpDatabase<typeof schema> {
    if (!_db) {
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            throw new Error(
                "DATABASE_URL is not set. Please configure your environment variables."
            );
        }
        const sql = neon(databaseUrl);
        _db = drizzle(sql, { schema });
    }
    return _db;
}

// Proxy that lazily initializes the db on first property access
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
    get(_, prop) {
        const instance = getDb();
        const value = (instance as any)[prop];
        return typeof value === "function" ? value.bind(instance) : value;
    },
});

export { schema };
export type DB = NeonHttpDatabase<typeof schema>;
