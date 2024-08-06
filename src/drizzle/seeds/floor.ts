import { db } from '../db';
import { floor } from "../schema";
import floors from './data/floor.json';

export default async function seed(dbInstance: typeof db) {
    await dbInstance.insert(floor).values(floors);
}