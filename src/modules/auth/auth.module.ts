import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {UsersModule} from "../user/user.module";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./jwt.strategy/jwt.strategy";

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // از JWT_SECRET موجود در .env استفاده کنید
      signOptions: { expiresIn: '60s' }, // زمان انقضا
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
