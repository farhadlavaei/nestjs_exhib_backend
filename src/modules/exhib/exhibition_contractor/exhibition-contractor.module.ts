import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionContractorController } from './exhibition-contractor.controller';
import { ExhibitionContractorService } from './exhibition-contractor.service';
import { ExhibitionContractor } from './entities/exhibition-contractor.entity';
import { ExhibitionContractorRepository } from './exhibition-contractor.repository';
import {ExhibitionEvent} from "../exhibition-event/entities/exhibition-event.entity";
import {Company} from "../company/entities/company.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ExhibitionContractor, ExhibitionEvent, Company])],
    controllers: [ExhibitionContractorController],
    providers: [ExhibitionContractorService, ExhibitionContractorRepository],
    exports: [ExhibitionContractorService, ExhibitionContractorRepository],
})
export class ExhibitionContractorModule {}
