import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateExhibitionBoothDto } from './dto/create-exhibition-booth.dto';
import { UpdateExhibitionBoothDto } from './dto/update-exhibition-booth.dto';
import { ExhibitionBooth } from './entities/exhibition-booth.entity';
import logger from '../../../logger';
import {ExhibitionBoothRepository} from "./exhibition-booth.repository";

@Injectable()
export class ExhibitionBoothService {
    constructor(
        @InjectRepository(ExhibitionBoothRepository)
        private readonly exhibitionBoothRepository: ExhibitionBoothRepository,
    ) {}

    async getBooths(perPage: number = 10): Promise<ExhibitionBooth[]> {
        try {
            return await this.exhibitionBoothRepository.getBooths(perPage);
        } catch (error) {
            logger.error('Error retrieving exhibition booths:', error);
            throw new InternalServerErrorException('Failed to retrieve exhibition booths.');
        }
    }

    async getBoothById(id: number): Promise<ExhibitionBooth> {
        try {
            const booth = await this.exhibitionBoothRepository.getBoothById(id);
            if (!booth) {
                throw new NotFoundException(`Exhibition booth with ID ${id} not found.`);
            }
            return booth;
        } catch (error) {
            logger.error(`Error retrieving exhibition booth with ID ${id}:`, error);
            throw new InternalServerErrorException('Failed to retrieve exhibition booth.');
        }
    }

    async createBooth(createExhibitionBoothDto: CreateExhibitionBoothDto): Promise<ExhibitionBooth> {
        try {
            return await this.exhibitionBoothRepository.createBooth(createExhibitionBoothDto);
        } catch (error) {
            logger.error('Error creating exhibition booth:', error);
            throw new InternalServerErrorException('Failed to create exhibition booth.');
        }
    }

    async updateBooth(id: number, updateExhibitionBoothDto: UpdateExhibitionBoothDto): Promise<ExhibitionBooth> {
        try {
            return await this.exhibitionBoothRepository.updateBooth(id, updateExhibitionBoothDto);
        } catch (error) {
            logger.error(`Error updating exhibition booth with ID ${id}:`, error);
            throw new InternalServerErrorException('Failed to update exhibition booth.');
        }
    }

    async deleteBooth(id: number): Promise<void> {
        try {
            await this.exhibitionBoothRepository.deleteBooth(id);
        } catch (error) {
            logger.error(`Error deleting exhibition booth with ID ${id}:`, error);
            throw new InternalServerErrorException('Failed to delete exhibition booth.');
        }
    }
}
