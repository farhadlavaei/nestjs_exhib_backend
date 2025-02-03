import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import {getRepositoryToken, TypeOrmModule} from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { User } from '../../user/entities/user.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import {CompanyRepository} from "./company.repository";
import {UserRepository} from "../../user/user.repository";
import {CompanyController} from "./company.controller";

describe('CompanyService', () => {
    let companyService: any;
    let companyRepository: any;
    let userRepository: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [TypeOrmModule.forFeature([Company, User])],
            controllers: [CompanyController],
            providers: [CompanyService, CompanyRepository, UserRepository],
            exports: [CompanyService, CompanyRepository],
        }).compile();

        companyService = module.get<CompanyService>(CompanyService);
        companyRepository = module.get<CompanyRepository>(CompanyRepository);
        userRepository = module.get<UserRepository>(UserRepository);
    });

    it('should be defined', () => {
        expect(companyService).toBeDefined();
    });

    describe('getCompanies', () => {
        it('should return list of companies for a given user', async () => {
            const userId = 1;
            const perPage = 10;
            const companies = [{ id: 1, company_name: 'Test Company' }];

            jest.spyOn(companyRepository, 'find').mockResolvedValue(companies as any);

            const result = await companyService.getCompanies(userId, perPage);
            expect(result).toEqual(companies);
        });
    });

    describe('createCompany', () => {
        it('should create a company successfully', async () => {
            const userId = 1;
            const createCompanyDto: CreateCompanyDto = {
                company_name: 'Test Company',
                company_name_en: 'Test Company EN',
                economic_code: '123456789',
                registration_number: '987654321',
                address: 'Test Address',
                address_en: 'Test Address EN',
                activity_type: 'Software',
                activity_description: 'This is a software company',
                activity_description_en: 'This is a software company in English',
                brand_names: 'Brand X',
                brand_names_en: 'Brand X EN',
                national_id: '1234567890',
                email: 'test@example.com',
                website: 'https://testcompany.com'
            };

            const user = new User();
            user.id = userId;

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
            jest.spyOn(companyRepository, 'save').mockResolvedValue({ id: 1, ...createCompanyDto } as any);

            const result = await companyService.createCompany(userId, createCompanyDto);
            expect(result).toEqual({ id: 1, ...createCompanyDto });
        });

        it('should throw NotFoundException if user does not exist', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            const createCompanyDto = new CreateCompanyDto();
            await expect(companyService.createCompany(1, createCompanyDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('getCompanyById', () => {
        it('should return a company by id', async () => {
            const id = 1;
            const userId = 1;
            const company = new Company();
            company.id = id;
            company.user = { id: userId } as User;

            jest.spyOn(companyRepository, 'findOne').mockResolvedValue(company);

            const result = await companyService.getCompanyById(id, userId);
            expect(result).toEqual(company);
        });

        it('should throw UnauthorizedException if user is not the owner', async () => {
            const id = 1;
            const userId = 2;
            const company = new Company();
            company.id = id;
            company.user = { id: 3 } as User;

            jest.spyOn(companyRepository, 'findOne').mockResolvedValue(company);

            await expect(companyService.getCompanyById(id, userId)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw NotFoundException if company is not found', async () => {
            jest.spyOn(companyRepository, 'findOne').mockResolvedValue(null);

            await expect(companyService.getCompanyById(1, 1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateCompany', () => {
        it('should update a company successfully', async () => {
            const id = 1;
            const userId = 1;
            const updateCompanyDto: UpdateCompanyDto = {
                company_name: 'Updated Name',
            };

            const company = new Company();
            company.id = id;
            company.user = { id: userId } as User;

            jest.spyOn(companyService, 'getCompanyById').mockResolvedValue(company);
            jest.spyOn(companyRepository, 'save').mockResolvedValue({ ...company, ...updateCompanyDto } as any);

            const result = await companyService.updateCompany(id, userId, updateCompanyDto);
            expect(result).toEqual({ ...company, ...updateCompanyDto });
        });
    });

    describe('deleteCompany', () => {
        it('should delete a company successfully', async () => {
            const id = 1;
            const userId = 1;
            const company = new Company();
            company.id = id;
            company.user = { id: userId } as User;

            jest.spyOn(companyService, 'getCompanyById').mockResolvedValue(company);
            jest.spyOn(companyRepository, 'delete').mockResolvedValue({ affected: 1 } as any);

            const result = await companyService.deleteCompany(id, userId);
            expect(result).toEqual({ affected: 1 });
        });
    });
});
