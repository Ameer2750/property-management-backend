import 'dotenv/config';

import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from './schema';
import postgres from "postgres";

export const client = postgres(process.env.DATABASE_URL as string, {
    max: 1,
});

export const db = drizzle(client, { schema, logger: true })
