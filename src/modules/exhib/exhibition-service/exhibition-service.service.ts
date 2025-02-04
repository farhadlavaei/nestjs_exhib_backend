import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
    BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExhibitionService } from './entities/exhibition-service.entity';
import { CreateExhibitionServiceDto } from './dto/create-exhibition-service.dto';
import { UpdateExhibitionServiceDto } from './dto/update-exhibition-service.dto';
import logger from '../../../logger';

@Injectable()
export class ExhibitionServiceService {
    constructor(
        @InjectRepository(ExhibitionService)
        private readonly exhibitionServiceRepository: Repository<ExhibitionService>,
    ) {}

    /**
     * Retrieve a paginated list of exhibition services.
     * @param perPage - Number of services per page.
     */
    async getServices(perPage: number): Promise<ExhibitionService[]> {
        try {
            return await this.exhibitionServiceRepository.find({
                take: perPage || 10,
                order: { id: 'DESC' },
            });
        } catch (error) {
            logger.error('Error retrieving exhibition services:', error);
            throw new InternalServerErrorException('Failed to fetch exhibition services.');
        }
    }

    /**
     * Retrieve a single exhibition service by ID.
     * @param id - Service ID
     */
    async getServiceById(id: number): Promise<ExhibitionService> {
        try {
            const service = await this.exhibitionServiceRepository.findOne({ where: { id } });
            if (!service) {
                throw new NotFoundException(`Exhibition service with ID ${id} not found.`);
            }
            return service;
        } catch (error) {
            logger.error(`Error retrieving exhibition service with ID ${id}:`, error);
            throw new InternalServerErrorException('Failed to fetch exhibition service.');
        }
    }

    /**
     * Create a new exhibition service.
     * @param createServiceDto - Data transfer object for service creation.
     */
    async createService(createServiceDto: CreateExhibitionServiceDto): Promise<ExhibitionService> {
        try {
            const service = this.exhibitionServiceRepository.create({
                ...createServiceDto,
                created_at: new Date(),
                updated_at: new Date(),
            });

            const savedService = await this.exhibitionServiceRepository.save(service);
            return savedService;
        } catch (error) {
            logger.error('Error creating exhibition service:', error);
            throw new InternalServerErrorException('Failed to create exhibition service.');
        }
    }

    /**
     * Update an existing exhibition service.
     * @param id - Service ID
     * @param updateServiceDto - Data transfer object for service update.
     */
    async updateService(id: number, updateServiceDto: UpdateExhibitionServiceDto): Promise<ExhibitionService> {
        try {
            const service = await this.getServiceById(id);
            Object.assign(service, updateServiceDto, { updated_at: new Date() });

            return await this.exhibitionServiceRepository.save(service);
        } catch (error) {
            logger.error(`Error updating exhibition service with ID ${id}:`, error);
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to update exhibition service.');
        }
    }

    /**
     * Delete an exhibition service (soft delete).
     * @param id - Service ID
     */
    async deleteService(id: number): Promise<void> {
        try {
            const service = await this.getServiceById(id);
            await this.exhibitionServiceRepository.softRemove(service);
        } catch (error) {
            logger.error(`Error deleting exhibition service with ID ${id}:`, error);
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to delete exhibition service.');
        }
    }
}
