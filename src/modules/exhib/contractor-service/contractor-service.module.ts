import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractorServiceController } from './contractor-service.controller';
import { ContractorServiceService } from './contractor-service.service';
import { ContractorService } from './entities/contractor-service.entity';
import { ContractorServiceRepository } from './contractor-service.repository';

@Module({
    imports: [TypeOrmModule.forFeature([ContractorService])],
    controllers: [ContractorServiceController],
    providers: [ContractorServiceService, ContractorServiceRepository],
    exports: [ContractorServiceService, ContractorServiceRepository],
})
export class ContractorServiceModule {}
