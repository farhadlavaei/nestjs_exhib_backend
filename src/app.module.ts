import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from "./modules/user/user.module";
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from "./modules/auth/auth.module";
import { JwtStrategy } from "./modules/auth/jwt.strategy/jwt.strategy";
import { AiService } from "./helpers/ai.service";
import { CompanyModule } from "./modules/exhib/company/company.module";
import {ExhibitionEventModule} from "./modules/exhib/exhibition-event/exhibition-event.module";
import {LocationModule} from "./modules/exhib/location/location.module";

const myModules = [
    UsersModule,
    CompanyModule,
    ExhibitionEventModule,
    LocationModule
]

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
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
                synchronize: false,
                logging: true
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        HttpModule,
        ...myModules
    ],
    controllers: [],
    providers: [JwtStrategy, AiService],
})
export class AppModule {}


