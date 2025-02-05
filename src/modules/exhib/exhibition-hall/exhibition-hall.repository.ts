import { Repository, DataSource } from 'typeorm';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ExhibitionHall } from './entities/exhibition-hall.entity';
import logger from '../../../logger';

@Injectable()
export class ExhibitionHallRepository extends Repository<ExhibitionHall> {
    constructor(private readonly dataSource: DataSource) {
        super(ExhibitionHall, dataSource.createEntityManager());
    }

    async getHalls(): Promise<ExhibitionHall[]> {
        try {
            return await this.find();
        } catch (error) {
            logger.error('Error retrieving halls:', error);
            throw new InternalServerErrorException('Failed to retrieve halls.');
        }
    }

    async getHallById(id: number): Promise<ExhibitionHall> {
        try {
            const hall = await this.findOne({ where: { id } });
            if (!hall) throw new NotFoundException(`Hall with ID ${id} not found.`);
            return hall;
        } catch (error) {
            logger.error(`Error retrieving hall with ID ${id}:`, error);
            throw new InternalServerErrorException('Failed to retrieve hall.');
        }
    }

    async createHall(data: Partial<ExhibitionHall>): Promise<ExhibitionHall> {
        try {
            const hall = this.create(data);
            return await this.save(hall);
        } catch (error) {
            throw new InternalServerErrorException('Error creating hall', error.message);
        }
    }

    async updateHall(id: number, data: Partial<ExhibitionHall>): Promise<ExhibitionHall> {
        try {
            await this.update(id, data);
            return await this.getHallById(id);
        } catch (error) {
            throw new InternalServerErrorException(`Error updating hall with ID ${id}`, error.message);
        }
    }

    async deleteHall(id: number): Promise<void> {
        try {
            const hall = await this.getHallById(id);
            await this.softRemove(hall);
        } catch (error) {
            throw new InternalServerErrorException(`Error deleting hall with ID ${id}`, error.message);
        }
    }
}
