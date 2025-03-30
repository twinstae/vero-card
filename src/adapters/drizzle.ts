import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
// In-memory Postgres
const client = new PGlite();
const db = drizzle({ client });
