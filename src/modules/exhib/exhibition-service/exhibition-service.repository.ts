import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { ExhibitionService } from './entities/exhibition-service.entity';
import logger from '../../../logger';
import { CreateExhibitionServiceDto } from './dto/create-exhibition-service.dto';
import { UpdateExhibitionServiceDto } from './dto/update-exhibition-service.dto';

@Injectable()
export class ExhibitionServiceRepository extends Repository<ExhibitionService> {
    constructor(private readonly dataSource: DataSource) {
        super(ExhibitionService, dataSource.createEntityManager());
    }

    /**
     * Retrieves a paginated list of exhibition services.
     * @param perPage - Number of services per page (default: 10).
     * @returns A promise resolving to an array of ExhibitionService entities.
     * @throws InternalServerErrorException if the retrieval fails.
     */
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

    /**
     * Retrieves an exhibition service by its ID.
     * @param id - The unique identifier of the service.
     * @returns A promise resolving to the ExhibitionService entity.
     * @throws NotFoundException if the service is not found.
     * @throws InternalServerErrorException if the retrieval fails.
     */
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

    /**
     * Creates a new exhibition service.
     * @param data - Data Transfer Object containing service details.
     * @returns A promise resolving to the created ExhibitionService entity.
     * @throws InternalServerErrorException if the creation fails.
     */
    async createService(data: CreateExhibitionServiceDto): Promise<ExhibitionService> {
        try {
            const service = this.create(data);
            return await this.save(service);
        } catch (error) {
            throw new InternalServerErrorException('Error creating a new service', error.message);
        }
    }

    /**
     * Updates an existing exhibition service.
     * @param id - The unique identifier of the service.
     * @param data - Data Transfer Object containing updated service details.
     * @returns A promise resolving to the updated ExhibitionService entity.
     * @throws NotFoundException if the service is not found.
     * @throws InternalServerErrorException if the update fails.
     */
    async updateService(id: number, data: UpdateExhibitionServiceDto): Promise<ExhibitionService> {
        try {
            const service = await this.getServiceById(id);
            Object.assign(service, data);
            return await this.save(service);
        } catch (error) {
            throw new InternalServerErrorException(`Error updating service with ID ${id}`, error.message);
        }
    }

    /**
     * Deletes an exhibition service (soft delete).
     * @param id - The unique identifier of the service.
     * @returns A promise resolving to the deleted ExhibitionService entity.
     * @throws NotFoundException if the service is not found.
     * @throws InternalServerErrorException if the deletion fails.
     */
    async deleteService(id: number) {
        try {
            const service = await this.getServiceById(id);
            return await this.softRemove(service);
        } catch (error) {
            throw new InternalServerErrorException(`Error deleting service with ID ${id}`, error.message);
        }
    }
}
