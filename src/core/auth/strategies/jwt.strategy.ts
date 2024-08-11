import { ExtractJwt, Strategy } from 'passport-jwt';
import { InferSelectModel } from 'drizzle-orm';
import { user } from './../../../drizzle/schema';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../../config/env/configuration';
import { UserService } from 'src/core/users/users.service';
import { processObject } from 'src/common/utilities/helpers/process-object';

type UserTable = InferSelectModel<typeof user>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly userService: UserService;

  constructor(
    userService: UserService,
    configService: ConfigService<EnvironmentVariables>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtSecret'),
    });
    this.userService = userService;
  }

  async validate(payload: any): Promise<UserTable | null> {
    const authUser = await this.userService.findOne(payload.email);
    if (!authUser) {
      throw new UnauthorizedException();
    }
    return processObject(authUser, ['password', 'createdAt', 'updatedAt']);
  }
}