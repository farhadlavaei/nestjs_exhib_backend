import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Speaker } from './entities/speaker.entity';
import logger from '../../../logger';
import {CreateSpeakerDto} from "./dto/create-speaker.dto";
import {UpdateSpeakerDto} from "./dto/update-speaker.dto";

@Injectable()
export class SpeakerRepository extends Repository<Speaker> {
    constructor(private readonly dataSource: DataSource) {
        super(Speaker, dataSource.createEntityManager());
    }

    /**
     * Retrieve a list of speakers with pagination.
     * @param perPage Number of items per page (default: 10)
     */
    async getSpeakers(perPage: number = 10): Promise<Speaker[]> {
        try {
            return await this.createQueryBuilder('speaker')
                .orderBy('speaker.created_at', 'DESC')
                .take(perPage)
                .getMany();
        } catch (error) {
            logger.error('Error retrieving speakers:', error);
            throw new InternalServerErrorException('Failed to retrieve speakers.');
        }
    }

    /**
     * Retrieve a specific speaker by ID.
     * @param id Speaker ID
     */
    async getSpeakerById(id: number): Promise<Speaker> {
        try {
            const speaker = await this.createQueryBuilder('speaker')
                .where('speaker.id = :id', { id })
                .getOne();

            if (!speaker) {
                throw new NotFoundException(`Speaker with ID ${id} not found.`);
            }
            return speaker;
        } catch (error) {
            logger.error(`Error retrieving speaker with ID ${id}:`, error);
            throw new InternalServerErrorException('Failed to retrieve speaker.');
        }
    }

    /**
     * Create a new speaker.
     * @param data Speaker details
     */
    async createSpeaker(data: CreateSpeakerDto): Promise<Speaker> {
        try {
            const speaker = this.create({
                event: { id: data.event_id },
                user: { id: data.user_id },
            });

            return await this.save(speaker);
        } catch (error) {
            logger.error('Error creating speaker:', error);
            throw new InternalServerErrorException('Failed to create speaker.');
        }
    }

    /**
     * Update an existing speaker.
     * @param id Speaker ID
     * @param data Updated speaker details
     */
    async updateSpeaker(id: number, data: UpdateSpeakerDto): Promise<Speaker> {
        try {
            const speaker = await this.getSpeakerById(id);
            if (!speaker) throw new NotFoundException(`Speaker with ID ${id} not found.`);

            Object.assign(speaker, data);
            return await this.save(speaker);
        } catch (error) {
            logger.error(`Error updating speaker with ID ${id}:`, error);
            throw new InternalServerErrorException(`Failed to update speaker with ID ${id}.`);
        }
    }

    /**
     * Delete a speaker (soft delete).
     * @param id Speaker ID
     */
    async deleteSpeaker(id: number): Promise<Speaker> {
        try {
            const speaker = await this.getSpeakerById(id);
            if (!speaker) throw new NotFoundException(`Speaker with ID ${id} not found.`);

            // Perform soft delete
            await this.update(id, { deleted_at: new Date() });

            return speaker;
        } catch (error) {
            throw new InternalServerErrorException(`Error deleting speaker with ID ${id}`, error.message);
        }
    }
}
