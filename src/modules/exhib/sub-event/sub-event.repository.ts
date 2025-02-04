import { Repository, DataSource } from 'typeorm';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SubEvent } from './entities/sub-event.entity';
import { CreateSubEventDto } from './dto/create-sub-event.dto';
import { UpdateSubEventDto } from './dto/update-sub-event.dto';
import logger from '../../../logger';

@Injectable()
export class SubEventRepository extends Repository<SubEvent> {
    constructor(private readonly dataSource: DataSource) {
        super(SubEvent, dataSource.createEntityManager());
    }

    /**
     * Retrieve a list of sub-events with pagination.
     * @param perPage Number of items per page (default: 10)
     */
    async getSubEvents(perPage: number = 10): Promise<SubEvent[]> {
        try {
            return await this.createQueryBuilder('subEvent')
                .orderBy('subEvent.created_at', 'DESC')
                .take(perPage)
                .getMany();
        } catch (error) {
            logger.error('Error retrieving sub-events list:', error);
            throw new InternalServerErrorException('Failed to retrieve sub-events.');
        }
    }

    /**
     * Retrieve a specific sub-event by ID.
     * @param id SubEvent ID
     */
    async getSubEventById(id: number): Promise<SubEvent> {
        try {
            const subEvent = await this.createQueryBuilder('subEvent')
                .where('subEvent.id = :id', { id })
                .getOne();

            if (!subEvent) {
                throw new NotFoundException(`Sub-event with ID ${id} not found.`);
            }
            return subEvent;
        } catch (error) {
            logger.error(`Error retrieving sub-event with ID ${id}:`, error);
            throw new InternalServerErrorException('Failed to retrieve sub-event.');
        }
    }

    /**
     * Create a new sub-event.
     * @param data SubEvent details
     */
    async createSubEvent(data: CreateSubEventDto): Promise<SubEvent> {
        try {
            const subEvent = this.create({
                ...data,
                created_at: new Date(),
                updated_at: new Date(),
            });
            return await this.save(subEvent);
        } catch (error) {
            logger.error('Error creating sub-event:', error);
            throw new InternalServerErrorException('Failed to create sub-event.');
        }
    }

    /**
     * Update an existing sub-event.
     * @param id SubEvent ID
     * @param data Updated sub-event details
     */
    async updateSubEvent(id: number, data: UpdateSubEventDto): Promise<SubEvent> {
        try {
            const subEvent = await this.getSubEventById(id);
            if (!subEvent) throw new NotFoundException(`Sub-event with ID ${id} not found.`);

            await this.update(id, { ...data, updated_at: new Date() });
            return await this.getSubEventById(id);
        } catch (error) {
            logger.error(`Error updating sub-event with ID ${id}:`, error);
            throw new InternalServerErrorException('Failed to update sub-event.');
        }
    }

    /**
     * Delete a sub-event (soft delete).
     * @param id SubEvent ID
     */
    async deleteSubEvent(id: number): Promise<SubEvent> {
        try {
            const subEvent = await this.getSubEventById(id);
            if (!subEvent) throw new NotFoundException(`Sub-event with ID ${id} not found.`);

            await this.update(id, { deleted_at: new Date() });

            return subEvent;
        } catch (error) {
            logger.error(`Error deleting sub-event with ID ${id}:`, error);
            throw new InternalServerErrorException('Failed to delete sub-event.');
        }
    }
}
