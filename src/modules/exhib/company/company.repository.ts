import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class CompanyRepository {
    constructor(
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
    ) {}

    async findCompaniesByUserId(userId: number, perPage: number) {
        return await this.companyRepository.find({
            where: {
                user: { id: userId },
                deleted_at: null,
            },
            order: { id: 'DESC' },
            take: perPage,
        } as any);
    }


    async findById(id: number) {
        return await this.companyRepository.findOne({
            where: { id },
            relations: ['user'],
        });
    }

    async createCompany(user: User, createCompanyDto: CreateCompanyDto) {
        const company = this.companyRepository.create({
            ...createCompanyDto,
            user,
            created_at: new Date(),
            updated_at: new Date(),
        });

        return await this.companyRepository.save(company);
    }

    async updateCompany(id: number, updateCompanyDto: UpdateCompanyDto) {
        await this.companyRepository.update(id, {
            ...updateCompanyDto,
            updated_at: new Date(),
        } as any);

        return await this.findById(id);
    }

    async deleteCompany(id: number) {
        return await this.companyRepository.softDelete(id);
    }
}
