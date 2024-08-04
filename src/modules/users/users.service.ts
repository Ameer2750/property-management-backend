import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Inject, Injectable } from "@nestjs/common";
import { DRIZZLE_ORM } from "src/common/utilities/constants";
import * as schema from '../../drizzle/schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { user } from '../../drizzle/schema';
// Define the type for user data
type CreateUserDto = {
    username: string;
    email: string;
    phone?: string;
    role: string;
};

// Define the type for the user table model
type UserTableType = InferInsertModel<typeof schema.user>;

@Injectable()
export class UserService {
    constructor(
        @Inject(DRIZZLE_ORM) private readonly drizzle: PostgresJsDatabase<typeof schema>,
    ) { }

    // Implement the createUser method
    public async createUser(createUserDto: CreateUserDto): Promise<UserTableType> {

        // Insert the user data into the database
        const [newUser] = await this.drizzle
            .insert(user)
            .values(createUserDto)
            .returning();
        // Return the created user
        return newUser;
    }
}