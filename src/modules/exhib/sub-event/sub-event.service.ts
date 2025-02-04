import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
    BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubEventRepository } from './sub-event.repository';
import { CreateSubEventDto } from './dto/create-sub-event.dto';
import { UpdateSubEventDto } from './dto/update-sub-event.dto';
import logger from '../../../logger';

@Injectable()
export class SubEventService {
    constructor(
        @InjectRepository(SubEventRepository)
        private readonly subEventRepository: SubEventRepository,
    ) {}

    /**
     * Retrieve a paginated list of sub-events.
     * @param perPage - Number of sub-events per page.
     */
    async getSubEvents(perPage: number) {
        try {
            return await this.subEventRepository.getSubEvents(perPage);
        } catch (error) {
            logger.error('Error retrieving sub-events:', error);
            throw new InternalServerErrorException('Failed to fetch sub-events.');
        }
    }

    /**
     * Retrieve a single sub-event by ID.
     * @param id - SubEvent ID
     */
    async getSubEventById(id: number) {
        try {
            const subEvent = await this.subEventRepository.getSubEventById(id);
            if (!subEvent) {
                throw new NotFoundException(`Sub-event with ID ${id} not found.`);
            }
            return subEvent;
        } catch (error) {
            logger.error(`Error retrieving sub-event with ID ${id}:`, error);
            throw new InternalServerErrorException('Failed to fetch sub-event.');
        }
    }

    /**
     * Create a new sub-event.
     * @param createSubEventDto - Data transfer object for sub-event creation.
     */
    async createSubEvent(createSubEventDto: CreateSubEventDto) {
        try {
            return await this.subEventRepository.createSubEvent(createSubEventDto);
        } catch (error) {
            logger.error('Error creating sub-event:', error);
            throw new InternalServerErrorException('Failed to create sub-event.');
        }
    }

    /**
     * Update an existing sub-event.
     * @param id - SubEvent ID
     * @param updateSubEventDto - Data transfer object for sub-event update.
     */
    async updateSubEvent(id: number, updateSubEventDto: UpdateSubEventDto) {
        try {
            return await this.subEventRepository.updateSubEvent(id, updateSubEventDto);
        } catch (error) {
            logger.error(`Error updating sub-event with ID ${id}:`, error);
            throw new InternalServerErrorException('Failed to update sub-event.');
        }
    }

    /**
     * Delete a sub-event (soft delete).
     * @param id - SubEvent ID
     */
    async deleteSubEvent(id: number) {
        try {
            return await this.subEventRepository.deleteSubEvent(id);
        } catch (error) {
            logger.error(`Error deleting sub-event with ID ${id}:`, error);
            throw new InternalServerErrorException('Failed to delete sub-event.');
        }
    }
}
