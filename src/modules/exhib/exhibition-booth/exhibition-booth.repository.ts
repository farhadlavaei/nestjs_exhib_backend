import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { ExhibitionBooth } from './entities/exhibition-booth.entity';
import logger from '../../../logger';
import { CreateExhibitionBoothDto } from './dto/create-exhibition-booth.dto';
import { UpdateExhibitionBoothDto } from './dto/update-exhibition-booth.dto';

@Injectable()
export class ExhibitionBoothRepository extends Repository<ExhibitionBooth> {
    constructor(private readonly dataSource: DataSource) {
        super(ExhibitionBooth, dataSource.createEntityManager());
    }

    async getBooths(perPage: number = 10): Promise<ExhibitionBooth[]> {
        try {
            return await this.createQueryBuilder('booth')
                .leftJoinAndSelect('booth.exhibition_event', 'event')
                .leftJoinAndSelect('booth.exhibition_hall', 'hall')
                .orderBy('booth.created_at', 'DESC')
                .take(perPage)
                .getMany();
        } catch (error) {
            logger.error('Error retrieving booths list:', error);
            throw new InternalServerErrorException('Failed to retrieve booths.');
        }
    }

    async getBoothById(id: number): Promise<ExhibitionBooth> {
        try {
            const booth = await this.findOne({ where: { id }, relations: ['exhibition_event', 'exhibition_hall', 'company'] });
            if (!booth) throw new NotFoundException(`Booth with ID ${id} not found.`);
            return booth;
        } catch (error) {
            logger.error(`Error retrieving booth with ID ${id}:`, error);
            throw new InternalServerErrorException('Failed to retrieve booth.');
        }
    }

    async createBooth(data: CreateExhibitionBoothDto): Promise<ExhibitionBooth> {
        try {
            const booth = this.create(data);
            return await this.save(booth);
        } catch (error) {
            throw new InternalServerErrorException('Error creating a new booth', error.message);
        }
    }

    async updateBooth(id: number, data: UpdateExhibitionBoothDto): Promise<ExhibitionBooth> {
        try {
            const booth = await this.getBoothById(id);
            Object.assign(booth, data);
            return await this.save(booth);
        } catch (error) {
            throw new InternalServerErrorException(`Error updating booth with ID ${id}`, error.message);
        }
    }

    async deleteBooth(id: number) {
        try {
            const booth = await this.getBoothById(id);
            return await this.softRemove(booth);
        } catch (error) {
            throw new InternalServerErrorException(`Error deleting booth with ID ${id}`, error.message);
        }
    }
}
