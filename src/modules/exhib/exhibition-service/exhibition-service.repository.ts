import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { ExhibitionService } from './entities/exhibition-service.entity';
import logger from '../../../logger';
import {CreateExhibitionServiceDto} from "./dto/create-exhibition-service.dto";
import {UpdateExhibitionServiceDto} from "./dto/update-exhibition-service.dto";

@Injectable()
export class ExhibitionServiceRepository extends Repository<ExhibitionService> {
    constructor(private readonly dataSource: DataSource) {
        super(ExhibitionService, dataSource.createEntityManager());
    }

    async getServices(perPage: number = 10): Promise<ExhibitionService[]> {
        try {
            return await this.createQueryBuilder('service')
                .leftJoinAndSelect('service.contractor', 'contractor')
                .orderBy('service.created_at', 'DESC')
                .take(perPage)
                .getMany();
        } catch (error) {
            logger.error('Error retrieving services list:', error);
            throw new InternalServerErrorException('Failed to retrieve services.');
        }
    }

    async getServiceById(id: number): Promise<ExhibitionService> {
        try {
            const service = await this.findOne({ where: { id }, relations: ['contractor'] });
            if (!service) throw new NotFoundException(`Service with ID ${id} not found.`);
            return service;
        } catch (error) {
            logger.error(`Error retrieving service with ID ${id}:`, error);
            throw new InternalServerErrorException('Failed to retrieve service.');
        }
    }

    async createService(data: CreateExhibitionServiceDto): Promise<ExhibitionService> {
        try {
            const service = this.create(data);
            return await this.save(service);
        } catch (error) {
            throw new InternalServerErrorException('Error creating a new service', error.message);
        }
    }

    async updateService(id: number, data: UpdateExhibitionServiceDto): Promise<ExhibitionService> {
        try {
            const service = await this.getServiceById(id);
            Object.assign(service, data);
            return await this.save(service);
        } catch (error) {
            throw new InternalServerErrorException(`Error updating service with ID ${id}`, error.message);
        }
    }

    async deleteService(id: number) {
        try {
            const service = await this.getServiceById(id);
            return await this.softRemove(service);
        } catch (error) {
            throw new InternalServerErrorException(`Error deleting service with ID ${id}`, error.message);
        }
    }
}
