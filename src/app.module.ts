import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtModule} from "@nestjs/jwt";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersModule} from "./modules/user/user.module";
import {HttpModule} from '@nestjs/axios';
import {AuthModule} from "./modules/auth/auth.module";
import {JwtStrategy} from "./modules/auth/jwt.strategy/jwt.strategy";
import {AiService} from "./helpers/ai.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret:
            configService.get<string>('JWT_SECRET') ||
            'F63FDB61-66FC-481C-80E2-91BCEAB59A6D',
        signOptions: {expiresIn: '8h'},
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: 3306,
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '../migrations/*{.ts,.js}'],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, AiService],
})
export class AppModule {
}
