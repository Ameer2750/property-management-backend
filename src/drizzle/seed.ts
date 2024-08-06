import { getTableName, sql, Table } from "drizzle-orm";
import { db } from "./db";
import * as schema from './schema';
import { floor, roomFeature, roomType } from "./seeds";

async function resetTable(dbInstance: typeof db, table: Table) {
    return db.execute(
        sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`)
    )
}

async function resetAndSeedTables() {
    // Reset tables
    for (const table of [
        schema.roomType,
        schema.roomFeature,
        schema.floor
    ]) {
        await resetTable(db, table);
    }

    // Seed tables
    await roomType(db);
    await roomFeature(db);
    await floor(db);
}

// Execute the main function
resetAndSeedTables()
    .then(() => {
        console.log('Tables reset and seeded successfully.');
    })
    .catch((error) => {
        console.error('Error resetting and seeding tables:', error);
    });




