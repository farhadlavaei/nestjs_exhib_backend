import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import { HttpModule, HttpService } from "@nestjs/axios";
import { JwtModule } from "@nestjs/jwt";
import { ConnectToApi } from "../../helpers/connect-to-api.helper";
import { AiService } from "../../helpers/ai.service";
import {User} from "./entities/user.entity";

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'F63FDB61-66FC-481C-80E2-91BCEAB59A6D',
            signOptions: { expiresIn: '8h' },
        }),
        TypeOrmModule.forFeature([User]),
        HttpModule,
    ],
    controllers: [UserController],
    providers: [
        UserService,
        UserRepository,
        {
            provide: ConnectToApi,
            useFactory: (httpService: HttpService) =>
                // Using non-null assertion to ensure the environment variables are strings.
                new ConnectToApi(
                    process.env.PARS_GREEN_MAIN_URL!, // Ensure PARS_GREEN_MAIN_URL is defined
                    process.env.PARS_GREEN_TOKEN!,      // Ensure PARS_GREEN_TOKEN is defined
                    httpService,
                ),
            inject: [HttpService],
        },
        AiService,
    ],
    exports: [UserService, UserRepository],
})
export class UsersModule {}
