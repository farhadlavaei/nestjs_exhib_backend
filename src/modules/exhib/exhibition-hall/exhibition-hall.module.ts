import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionHallController } from './exhibition-hall.controller';
import { ExhibitionHallService } from './exhibition-hall.service';
import { ExhibitionHallRepository } from './exhibition-hall.repository';
import { ExhibitionHall } from './entities/exhibition-hall.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ExhibitionHall])],
    controllers: [ExhibitionHallController],
    providers: [ExhibitionHallService, ExhibitionHallRepository],
    exports: [ExhibitionHallService],
})
export class ExhibitionHallModule {}
