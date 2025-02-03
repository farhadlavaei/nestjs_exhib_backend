import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CompanyRepository } from './company.repository';
import { Company } from './entities/company.entity';
import { UserRepository } from '../../user/user.repository';
import { User } from '../../user/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Company, User])],
    controllers: [CompanyController],
    providers: [CompanyService, CompanyRepository, UserRepository],
    exports: [CompanyService, CompanyRepository],
})
export class CompanyModule {}
