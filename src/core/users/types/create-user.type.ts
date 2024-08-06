import { roleEnum } from "src/drizzle/schema";

// Define the type for user data
export type CreateUserType = {
    username: string;
    email: string;
    phone?: string;
    role: typeof roleEnum;
};