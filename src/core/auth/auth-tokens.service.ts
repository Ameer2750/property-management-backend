import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from '../../drizzle/schema';
import { and, eq, InferSelectModel, lte } from 'drizzle-orm';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "src/config/env/configuration";
import { Cron, CronExpression } from "@nestjs/schedule";
import { DRIZZLE_ORM } from "src/common/utilities/constants/db.constant";

type UserTable = InferSelectModel<typeof schema.user>;

@Injectable()
export class AuthTokensService {
    constructor(
        @Inject(DRIZZLE_ORM) private readonly drizzle: PostgresJsDatabase<typeof schema>,
        private jwtService: JwtService,
        private configService: ConfigService<EnvironmentVariables>,
    ) { }

    async generateRefreshToken(
        authUserId: string,
        currentRefreshToken?: string,
        currentRefreshTokenExpiresAt?: Date,
    ): Promise<string> {
        const newRefreshToken = this.jwtService.sign(
            { sub: authUserId },
            {
                secret: this.configService.get('jwtRefreshSecret'),
                expiresIn: '30d',
            },
        );

        if (currentRefreshToken && currentRefreshTokenExpiresAt) {
            const isBlacklisted = await this.isRefreshTokenBlackListed(currentRefreshToken, authUserId);
            if (isBlacklisted) {
                throw new UnauthorizedException('Invalid refresh token.');
            }

            await this.drizzle.insert(schema.authRefreshToken).values({
                refreshToken: currentRefreshToken,
                expiresAt: currentRefreshTokenExpiresAt,
                userId: +authUserId, // Ensure consistent type handling
            });
        }

        return newRefreshToken;
    }

    private async isRefreshTokenBlackListed(refreshToken: string, userId: string): Promise<boolean> {
        const token = await this.drizzle.query.authRefreshToken.findFirst({
            where: and(
                eq(schema.authRefreshToken.userId, BigInt(userId)),
                eq(schema.authRefreshToken.refreshToken, refreshToken)
            ),
        });
        return !!token;
    }

    public async generateTokenPair(
        user: UserTable,
        currentRefreshToken?: string,
        currentRefreshTokenExpiresAt?: Date,
    ): Promise<{ access_token: string; refresh_token: string }> {
        const payload = { email: user.email, sub: user.id , };

        return {
            access_token: this.jwtService.sign(payload), // jwt module is configured in auth.module.ts for access token
            refresh_token: await this.generateRefreshToken(
                String(user.id),
                currentRefreshToken,
                currentRefreshTokenExpiresAt,
            ),
        };
    }

    // Uncomment if you plan to use the Cron job
    @Cron(CronExpression.EVERY_DAY_AT_6AM)
    async clearExpiredRefreshTokens(): Promise<void> {
        await this.drizzle
            .delete(schema.authRefreshToken)
            .where(lte(schema.authRefreshToken.expiresAt, new Date()));
    }
}
