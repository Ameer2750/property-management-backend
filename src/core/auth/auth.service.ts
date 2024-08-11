import { user } from './../../drizzle/schema';
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from '../../drizzle/schema';
import { InferSelectModel } from "drizzle-orm";
import { CryptoService } from '../crypto/crypto.service';
import { AuthTokensService } from './auth-tokens.service';
import { UserService } from '../users/users.service';
import { DRIZZLE_ORM } from 'src/common/utilities/constants/db.constant';
import { processObject } from 'src/common/utilities/helpers/process-object';


type UserTable = InferSelectModel<typeof schema.user>

type CreateUserType = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE_ORM) private readonly drizzle: PostgresJsDatabase<typeof schema>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private cryptoService: CryptoService,
    private readonly authRefreshTokenService: AuthTokensService
  ) { }


  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);
    const isMatch = await this.cryptoService.compareHash(password, user.password);
    if (user && isMatch ) {
      return processObject(user, ['password', 'createdAt', 'updatedAt']);
    }
    return null;
  }

  public async signup(signUpType: CreateUserType) {
    const data = await this.userService.createUser(signUpType);
    return data;
  }

  public async login(user: UserTable) {
    return this.authRefreshTokenService.generateTokenPair(user);
  }
}