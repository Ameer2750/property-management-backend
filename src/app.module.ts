import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestDrizzleModule } from './drizzle/drizzle.module';
import * as schema from './drizzle/schema';
import configuration from './config/env/configuration';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './core/auth/auth.module';
import { UserModule } from './core/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RoleGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    NestDrizzleModule.forRootAsync({
      useFactory: () => {
        return {
          driver: 'postgres-js',
          url: process.env.DATABASE_URL,
          options: { schema },
          migrationOptions: { migrationsFolder: './src/drizzle/migrations' },
        };
      },
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
