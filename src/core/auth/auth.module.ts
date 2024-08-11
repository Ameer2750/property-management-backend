import { JwtModule } from '@nestjs/jwt';
import { forwardRef, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "src/config/env/configuration";
import { CryptoModule } from "../crypto/crypto.module";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AuthTokensService } from "./auth-tokens.service";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";
import { UserModule } from "../users/users.module";

@Module({
  imports: [
    forwardRef(() => UserModule),
    CryptoModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        secret: configService.get('jwtSecret'),
        signOptions: { expiresIn: '30m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthTokensService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService]
})
export class AuthModule { }
