import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionBoothController } from './exhibition-booth.controller';
import { ExhibitionBoothService } from './exhibition-booth.service';
import { ExhibitionBooth } from './entities/exhibition-booth.entity';
import { ExhibitionBoothRepository } from './exhibition-booth.repository';

@Module({
    imports: [TypeOrmModule.forFeature([ExhibitionBooth])],
    controllers: [ExhibitionBoothController],
    providers: [ExhibitionBoothService, ExhibitionBoothRepository],
    exports: [ExhibitionBoothService]
})
export class ExhibitionBoothModule {}
