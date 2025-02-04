import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubEventController } from './sub-event.controller';
import { SubEventService } from './sub-event.service';
import { SubEvent } from './entities/sub-event.entity';
import { SubEventRepository } from './sub-event.repository';

@Module({
    imports: [TypeOrmModule.forFeature([SubEvent])],
    controllers: [SubEventController],
    providers: [SubEventService, SubEventRepository],
    exports: [SubEventService, SubEventRepository],
})
export class SubEventModule {}
