import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagramController } from './diagram.controller';
import { DiagramService } from './diagram.service';
import { Diagram } from './entities/diagram.entity';
import { DiagramRepository } from './diagram.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Diagram])],
    controllers: [DiagramController],
    providers: [DiagramService, DiagramRepository],
    exports: [DiagramService],
})
export class DiagramModule {}
