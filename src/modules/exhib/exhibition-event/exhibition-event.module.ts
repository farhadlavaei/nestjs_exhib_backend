import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionEventService } from './exhibition-event.service';
import { ExhibitionEventController } from './exhibition-event.controller';
import { ExhibitionEvent } from './entities/exhibition-event.entity';
import { Company } from '../company/entities/company.entity';
import {User} from "../../user/entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ExhibitionEvent, User, Company])],
    controllers: [ExhibitionEventController],
    providers: [ExhibitionEventService],
    exports: [ExhibitionEventService],
})
export class ExhibitionEventModule {}
