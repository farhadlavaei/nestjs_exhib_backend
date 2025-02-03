import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { CompanyRepository } from './company.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UserRepository } from '../../user/user.repository';

@Injectable()
export class CompanyService {
    constructor(
        private readonly companyRepository: CompanyRepository,
        private readonly userRepository: UserRepository,
    ) {}

    async getCompanies(userId: number, perPage: number) {
        return await this.companyRepository.findCompaniesByUserId(userId, perPage);
    }

    async createCompany(userId: number, createCompanyDto: CreateCompanyDto) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found.');
        }
        return await this.companyRepository.createCompany(user, createCompanyDto);
    }

    async getCompanyById(id: number, userId: number) {
        const company = await this.companyRepository.findById(id);
        if (!company || company.user.id !== userId) {
            throw new UnauthorizedException('Company not found or access denied.');
        }
        return company;
    }

    async updateCompany(id: number, userId: number, updateCompanyDto: UpdateCompanyDto) {
        const company = await this.getCompanyById(id, userId);
        return await this.companyRepository.updateCompany(company.id, updateCompanyDto);
    }

    async deleteCompany(id: number, userId: number) {
        const company = await this.getCompanyById(id, userId);
        return await this.companyRepository.deleteCompany(company.id);
    }
}
