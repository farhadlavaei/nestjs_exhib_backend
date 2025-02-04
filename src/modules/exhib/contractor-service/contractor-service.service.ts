import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
    BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContractorService } from './entities/contractor-service.entity';
import { CreateContractorServiceDto } from './dto/create-contractor-service.dto';
import { UpdateContractorServiceDto } from './dto/update-contractor-service.dto';
import logger from '../../../logger';

@Injectable()
export class ContractorServiceService {
    constructor(
        @InjectRepository(ContractorService)
        private readonly contractorServiceRepository: Repository<ContractorService>,
    ) {}

    /**
     * Retrieve a paginated list of contractor services.
     * @param perPage - Number of contractor services per page.
     */
    async getContractorServices(perPage: number) {
        try {
            return await this.contractorServiceRepository.find({
                take: perPage || 10,
                order: { id: 'DESC' },
            });
        } catch (error) {
            logger.error('Error retrieving contractor services:', error);
            throw new InternalServerErrorException('Failed to fetch contractor services.');
        }
    }

    /**
     * Retrieve a single contractor service by ID.
     * @param id - Contractor service ID
     */
    async getContractorServiceById(id: number): Promise<ContractorService> {
        try {
            const service = await this.contractorServiceRepository.findOne({ where: { id } });
            if (!service) {
                throw new NotFoundException(`Contractor service with ID ${id} not found.`);
            }
            return service;
        } catch (error) {
            logger.error(`Error retrieving contractor service with ID ${id}:`, error);
            throw new InternalServerErrorException('Failed to fetch contractor service.');
        }
    }

    /**
     * Create a new contractor service.
     * @param createContractorServiceDto - Data transfer object for contractor service creation.
     */
    async createContractorService(createContractorServiceDto: CreateContractorServiceDto) {
        try {
            logger.log('Received DTO:', createContractorServiceDto);

            const service = this.contractorServiceRepository.create({
                ...createContractorServiceDto,
                created_at: new Date(),
                updated_at: new Date(),
            });

            const savedService = await this.contractorServiceRepository.save(service);
            logger.log('Saved Contractor Service:', savedService);

            return savedService;
        } catch (error) {
            logger.error('Error creating contractor service:', error);
            throw new InternalServerErrorException('Failed to create contractor service.');
        }
    }

    /**
     * Update an existing contractor service.
     * @param id - Contractor service ID
     * @param updateContractorServiceDto - Data transfer object for contractor service update.
     */
    async updateContractorService(id: number, updateContractorServiceDto: UpdateContractorServiceDto): Promise<ContractorService> {
        try {
            const service = await this.getContractorServiceById(id);
            Object.assign(service, updateContractorServiceDto);
            service.updated_at = new Date();

            return await this.contractorServiceRepository.save(service);
        } catch (error) {
            logger.error(`Error updating contractor service with ID ${id}:`, error);
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to update contractor service.');
        }
    }

    /**
     * Delete a contractor service (soft delete).
     * @param id - Contractor service ID
     */
    async deleteContractorService(id: number): Promise<void> {
        try {
            const service = await this.getContractorServiceById(id);
            await this.contractorServiceRepository.softRemove(service);
        } catch (error) {
            logger.error(`Error deleting contractor service with ID ${id}:`, error);
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to delete contractor service.');
        }
    }

    /**
     * Attach a service to an exhibition for a contractor.
     * @param createContractorServiceDto - DTO for attaching a service.
     */
    async attachService(createContractorServiceDto: CreateContractorServiceDto): Promise<ContractorService> {
        try {
            logger.log('Attaching service:', createContractorServiceDto);

            const service = this.contractorServiceRepository.create({
                ...createContractorServiceDto,
                created_at: new Date(),
                updated_at: new Date(),
            });

            return await this.contractorServiceRepository.save(service);
        } catch (error) {
            logger.error('Error attaching service:', error);
            throw new InternalServerErrorException('Failed to attach service.');
        }
    }

    /**
     * Detach a service from an exhibition for a contractor.
     * @param contractorId - Contractor ID
     * @param exhibitionId - Exhibition ID
     * @param serviceId - Service ID
     */
    async detachService(contractorId: number, exhibitionId: number, serviceId: number): Promise<void> {
        try {
            const service = await this.contractorServiceRepository.findOne({
                where: { contractor_id: contractorId, exhibition_id: exhibitionId, service_id: serviceId },
            } as any);

            if (!service) {
                throw new NotFoundException('Service association not found.');
            }

            await this.contractorServiceRepository.update(service.id, { active: false, updated_at: new Date() });
        } catch (error) {
            logger.error('Error detaching service:', error);
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to detach service.');
        }
    }
}
