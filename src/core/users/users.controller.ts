import { Body, Controller } from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDto } from "./dtos";

@Controller()
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    public async createUser(@Body() createUserDto: CreateUserDto ) {
        return this.userService.createUser(createUserDto)
    }
}