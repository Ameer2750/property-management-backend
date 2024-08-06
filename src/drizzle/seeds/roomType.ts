import { db } from '../db';
import { roomType } from "../schema";
import roomTypes from './data/roomType.json';

export default async function seed(dbInstance: typeof db) {
  await dbInstance.insert(roomType).values(roomTypes);
}