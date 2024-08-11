import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from 'src/drizzle/schema';


export const ROLES_KEY = 'roles';
export const Roles = (...roles: typeof RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
