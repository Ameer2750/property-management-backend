import { roleEnum } from './../../drizzle/schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { DRIZZLE_ORM } from "src/common/utilities/constants";
import * as schema from '../../drizzle/schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { user } from '../../drizzle/schema';
import { CreateUserType } from './types';


// Define the type for the user table model
type UserTableType = InferInsertModel<typeof schema.user>;

@Injectable()
export class UserService {
    constructor(
        @Inject(DRIZZLE_ORM) private readonly drizzle: PostgresJsDatabase<typeof schema>,
    ) { }

    // Implement the createUser method
    public async createUser(createUserType: CreateUserType): Promise<UserTableType> {
        try {
            // Insert the user data into the database
            const [newUser] = await this.drizzle
                .insert(user)
                .values(createUserType)
                .returning();
            // Return the created user
            return newUser;
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}