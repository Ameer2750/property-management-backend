import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";

import * as schema from '../../drizzle/schema';
import { eq, InferSelectModel } from 'drizzle-orm';

import { CreateUserType } from './types';
import { DRIZZLE_ORM } from 'src/common/utilities/constants/db.constant';
import { processObject } from 'src/common/utilities/helpers/process-object';




// Define the type for the user table model
type UserTable = InferSelectModel<typeof schema.user>
@Injectable()
export class UserService {
    constructor(
        @Inject(DRIZZLE_ORM) private readonly drizzle: PostgresJsDatabase<typeof schema>,
    ) { }

    // Implement the createUser method
    public async createUser(createUserType: CreateUserType): Promise<UserTable> {
        try {
            // Insert the user data into the database
            const [newUser] = await this.drizzle
                .insert(schema.user)
                .values(createUserType)
                .returning();
            // Return the created user
            return newUser;
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    public async findOne(email: string): Promise<UserTable> {
        try {
            const data = await this.drizzle.query.user.findFirst({
                where: eq(schema.user.email, email)
            });

            return data
        } catch (error) {
            console.log('error: ', error);
            throw new InternalServerErrorException()
        }
    }

    public async findOneById(id: string): Promise<UserTable> {
        try {

            const data = await this.drizzle.query.user.findFirst({
                where: eq(schema.user.id, +id)
            })
            return processObject(data, ['password', 'createdAt', 'updatedAt'])
        } catch (error) {
            console.log('error: ', error);
            throw new InternalServerErrorException()
        }
    }


}