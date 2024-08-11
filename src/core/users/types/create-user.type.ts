import { RoleEnum } from "src/drizzle/schema";


export type CreateUserType = {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    phone: string;
    role?: string;
}
