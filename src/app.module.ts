import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestDrizzleModule } from './drizzle/drizzle.module';
import * as schema from './drizzle/schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
  ],
})
export class AppModule {}
