import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionEventService } from './entities/exhibition-event-service.entity';
import { ExhibitionEventServiceRepository } from './exhibition-event-service.repository';
import { ExhibitionEventServiceService } from './exhibition-event-service.service';
import { ExhibitionEventServiceController } from './exhibition-event-service.controller';
import { ExhibitionEvent } from '../exhibition-event/entities/exhibition-event.entity';
import { ExhibitionService } from '../exhibition-service/entities/exhibition-service.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ExhibitionEventService, ExhibitionEvent, ExhibitionService]),
    ],
    controllers: [ExhibitionEventServiceController],
    providers: [ExhibitionEventServiceService, ExhibitionEventServiceRepository],
    exports: [ExhibitionEventServiceService, ExhibitionEventServiceRepository],
})
export class ExhibitionEventServiceModule {}
