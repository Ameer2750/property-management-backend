import { db } from '../db';
import { roomFeature } from "../schema";
import roomFeatures from './data/roomFeature.json';

export default async function seed(dbInstance: typeof db) {
    await dbInstance.insert(roomFeature).values(roomFeatures);
  }