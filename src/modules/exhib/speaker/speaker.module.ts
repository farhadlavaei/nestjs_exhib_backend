import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpeakerService } from './speaker.service';
import { SpeakerController } from './speaker.controller';
import { Speaker } from './entities/speaker.entity';
import { SpeakerRepository } from './speaker.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Speaker])],
    controllers: [SpeakerController],
    providers: [SpeakerService, SpeakerRepository],
    exports: [SpeakerService],
})
export class SpeakerModule {}
