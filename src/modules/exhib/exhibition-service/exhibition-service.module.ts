import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionServiceController } from './exhibition-service.controller';
import { ExhibitionService } from './entities/exhibition-service.entity';
import {ExhibitionServiceService} from "./exhibition-service.service";
import {ExhibitionServiceRepository} from "./exhibition-service.repository";

@Module({
    imports: [TypeOrmModule.forFeature([ExhibitionService])],
    controllers: [ExhibitionServiceController],
    providers: [ExhibitionServiceService, ExhibitionServiceRepository],
    exports: [ExhibitionServiceService, ExhibitionServiceRepository],
})
export class ExhibitionServiceModule {}
