import { getTableName, sql, Table } from "drizzle-orm";
import { db, client } from "./db";
import * as schema from './schema';
// const dbType =

async function resetTable(dbInstance: typeof db, table: Table) {
    return db.execute(
        sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`)
    )
}

for (const table of [
    schema.roomType,
    schema.roomFeature,
    
]) {}