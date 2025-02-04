import {
    Injectable,
    NotFoundException,
    InternalServerErrorException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpeakerRepository } from './speaker.repository';
import { CreateSpeakerDto } from './dto/create-speaker.dto';
import { UpdateSpeakerDto } from './dto/update-speaker.dto';
import logger from '../../../logger';

@Injectable()
export class SpeakerService {
    constructor(
        @InjectRepository(SpeakerRepository)
        private readonly speakerRepository: SpeakerRepository,
    ) {}

    /**
     * Retrieve a paginated list of speakers.
     * @param perPage - Number of speakers per page.
     */
    async getSpeakers(perPage: number) {
        try {
            return await this.speakerRepository.getSpeakers(perPage);
        } catch (error) {
            logger.error('Error retrieving speakers:', error);
            throw new InternalServerErrorException('Failed to fetch speakers.');
        }
    }

    /**
     * Retrieve a single speaker by ID.
     * @param id - Speaker ID
     */
    async getSpeakerById(id: number) {
        try {
            const speaker = await this.speakerRepository.getSpeakerById(id);
            if (!speaker) {
                throw new NotFoundException(`Speaker with ID ${id} not found.`);
            }
            return speaker;
        } catch (error) {
            logger.error(`Error retrieving speaker with ID ${id}:`, error);
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to fetch speaker.');
        }
    }

    /**
     * Create a new speaker.
     * @param createSpeakerDto - Data transfer object for speaker creation.
     */
    async createSpeaker(createSpeakerDto: CreateSpeakerDto) {
        try {
            logger.log('Creating speaker:', createSpeakerDto);
            const speaker = await this.speakerRepository.createSpeaker(createSpeakerDto);
            logger.log('Speaker created successfully:', speaker);
            return speaker;
        } catch (error) {
            logger.error('Error creating speaker:', error);
            throw new InternalServerErrorException('Failed to create speaker.');
        }
    }

    /**
     * Update an existing speaker.
     * @param id - Speaker ID
     * @param updateSpeakerDto - Data transfer object for speaker update.
     */
    async updateSpeaker(id: number, updateSpeakerDto: UpdateSpeakerDto) {
        try {
            logger.log(`Updating speaker with ID ${id}:`, updateSpeakerDto);
            const updatedSpeaker = await this.speakerRepository.updateSpeaker(id, updateSpeakerDto);
            logger.log('Speaker updated successfully:', updatedSpeaker);
            return updatedSpeaker;
        } catch (error) {
            logger.error(`Error updating speaker with ID ${id}:`, error);
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to update speaker.');
        }
    }

    /**
     * Delete a speaker (soft delete).
     * @param id - Speaker ID
     */
    async deleteSpeaker(id: number) {
        try {
            logger.log(`Deleting speaker with ID: ${id}`, 'SpeakerService');

            const deletedSpeaker = await this.speakerRepository.deleteSpeaker(id);

            logger.log(`Speaker deleted successfully: ${JSON.stringify(deletedSpeaker)}`, 'SpeakerService');
            return deletedSpeaker;
        } catch (error) {
            logger.error(`Error deleting speaker with ID ${id}: ${error.message}`, error.stack, 'SpeakerService');

            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to delete speaker.');
        }
    }
}
