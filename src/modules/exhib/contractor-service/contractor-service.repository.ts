import { Repository, DataSource } from 'typeorm';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ContractorService } from './entities/contractor-service.entity';
import logger from '../../../logger';

@Injectable()
export class ContractorServiceRepository extends Repository<ContractorService> {
    constructor(private readonly dataSource: DataSource) {
        super(ContractorService, dataSource.createEntityManager());
    }

    /**
     * Retrieve a list of contractor services with pagination.
     * @param perPage Number of items per page (default: 10)
     */
    async getContractorServices(perPage: number = 10): Promise<ContractorService[]> {
        try {
            logger.log({ level: 'info', message: `Fetching contractor services with limit: ${perPage}` });
            const services = await this.createQueryBuilder('contractor_service')
                .orderBy('contractor_service.created_at', 'DESC')
                .take(perPage)
                .getMany();

            logger.log({ level: 'info', message: `Successfully fetched ${services.length} contractor services.` });
            return services;
        } catch (error) {
            logger.error({ level: 'error', message: 'Error retrieving contractor services', error: error.message });
            throw new InternalServerErrorException('Failed to retrieve contractor services.');
        }
    }

    /**
     * Retrieve a specific contractor service by ID.
     * @param id Contractor service ID
     */
    async getContractorServiceById(id: number): Promise<ContractorService> {
        try {
            logger.log({ level: 'info', message: `Fetching contractor service with ID: ${id}` });
            const service = await this.findOne({ where: { id } });

            if (!service) {
                logger.warn({ level: 'warn', message: `Contractor service with ID ${id} not found.` });
                throw new NotFoundException(`Contractor service with ID ${id} not found.`);
            }

            logger.log({ level: 'info', message: `Successfully fetched contractor service with ID: ${id}` });
            return service;
        } catch (error) {
            logger.error({ level: 'error', message: `Error retrieving contractor service with ID ${id}`, error: error.message });
            throw new InternalServerErrorException('Failed to retrieve contractor service.');
        }
    }

    /**
     * Create a new contractor service.
     * @param data Contractor service details
     */
    async createContractorService(data: Partial<ContractorService>): Promise<ContractorService> {
        try {
            logger.log({ level: 'info', message: 'Creating contractor service', data });
            const service = this.create({
                ...data,
                created_at: new Date(),
                updated_at: new Date(),
            });

            const savedService = await this.save(service);
            logger.log({ level: 'info', message: `Successfully created contractor service with ID: ${savedService.id}` });
            return savedService;
        } catch (error) {
            logger.error({ level: 'error', message: 'Error creating contractor service', error: error.message });
            throw new InternalServerErrorException('Error creating contractor service.');
        }
    }

    /**
     * Update an existing contractor service.
     * @param id Contractor service ID
     * @param data Updated contractor service details
     */
    async updateContractorService(id: number, data: Partial<ContractorService>): Promise<ContractorService> {
        try {
            logger.log({ level: 'info', message: `Updating contractor service with ID: ${id}` });
            const service = await this.getContractorServiceById(id);
            if (!service) throw new NotFoundException(`Contractor service with ID ${id} not found.`);

            await this.update(id, { ...data, updated_at: new Date() });
            const updatedService = await this.getContractorServiceById(id);

            logger.log({ level: 'info', message: `Successfully updated contractor service with ID: ${id}` });
            return updatedService;
        } catch (error) {
            logger.error({ level: 'error', message: `Error updating contractor service with ID ${id}`, error: error.message });
            throw new InternalServerErrorException(`Error updating contractor service with ID ${id}`);
        }
    }

    /**
     * Delete a contractor service (soft delete).
     * @param id Contractor service ID
     */
    async deleteContractorService(id: number): Promise<ContractorService> {
        try {
            logger.log({ level: 'info', message: `Deleting contractor service with ID: ${id}` });
            const service = await this.getContractorServiceById(id);
            if (!service) throw new NotFoundException(`Contractor service with ID ${id} not found.`);

            await this.update(id, { deleted_at: new Date() } as any);
            logger.log({ level: 'info', message: `Successfully deleted contractor service with ID: ${id}` });

            return service;
        } catch (error) {
            logger.error({ level: 'error', message: `Error deleting contractor service with ID ${id}`, error: error.message });
            throw new InternalServerErrorException(`Error deleting contractor service with ID ${id}`);
        }
    }
}
