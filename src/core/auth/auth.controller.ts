import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Post,
    Request,
    Res,
    UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from "src/common/guards/local-auth.guard";
import { AuthService } from "./auth.service";
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Public } from "src/common/decorators/public.decorator";
import { LoginDto, SignUpDto } from "./dtos";
import { InferSelectModel } from "drizzle-orm";
import * as schema from '../../drizzle/schema';
import { User } from "src/common/decorators/user.decorator";
import { JwtRefreshAuthGuard } from "src/common/guards/jwt-refresh.guard";

import { Response, Request as ExpressRequest } from 'express';
import { AuthTokensService } from './auth-tokens.service';
import { Roles } from 'src/common/decorators/roles.decorator';

type UserTable = InferSelectModel<typeof schema.userTable>;

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authenticationService: AuthService,
        private readonly authTokensService: AuthTokensService
    ) { }


    @Public()
    @Post('signup')
    public async signup(@Body() signUpDto: SignUpDto) {
        const user = await this.authenticationService.signup(signUpDto);
        return user;
    }


    @ApiBody({ type: LoginDto })
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Request() req: any) {
        return this.authenticationService.login(req.user);
    }


    @ApiBearerAuth()
    @Roles(schema.RoleEnum.ADMIN)
    @Get('me')
    async me(
        @User() authUser: UserTable,
        @Res({ passthrough: true }) res: Response,
    ) {
        res.header('Cache-Control', 'no-store');
        return authUser;
    }


    @ApiBearerAuth()
    @Public()
    @UseGuards(JwtRefreshAuthGuard)
    @Post('refresh-tokens')
    refreshTokens(@Request() req: ExpressRequest) {
        if (!req.user) {
            throw new InternalServerErrorException();
        }
        return this.authTokensService.generateTokenPair(
            (req.user as any).attributes,
            req.headers.authorization?.split(' ')[1],
            (req.user as any).refreshTokenExpiresAt,
        );
    }

}