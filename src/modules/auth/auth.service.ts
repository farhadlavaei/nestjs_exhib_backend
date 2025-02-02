import { Injectable } from '@nestjs/common';
import { JwtPayload } from './jwt.payload';
import {UserService} from "../user/user.service";

@Injectable()
export class AuthService {
    constructor(private usersService: UserService) {}

    async validateUser(payload: JwtPayload) {
        return await this.usersService.findById(payload.id);
    }
}
