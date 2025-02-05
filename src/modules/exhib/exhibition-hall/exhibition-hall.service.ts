import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ExhibitionHallRepository } from './exhibition-hall.repository';
import { CreateExhibitionHallDto } from './dto/create-exhibition-hall.dto';
import { UpdateExhibitionHallDto } from './dto/update-exhibition-hall.dto';
import logger from '../../../logger';

@Injectable()
export class ExhibitionHallService {
    constructor(private readonly hallRepository: ExhibitionHallRepository) {}

    async getHalls() {
        return this.hallRepository.getHalls();
    }

    async getHallById(id: number) {
        return this.hallRepository.getHallById(id);
    }

    async createHall(createHallDto: CreateExhibitionHallDto) {
        return this.hallRepository.createHall(createHallDto);
    }

    async updateHall(id: number, updateHallDto: UpdateExhibitionHallDto) {
        return this.hallRepository.updateHall(id, updateHallDto);
    }

    async deleteHall(id: number) {
        return this.hallRepository.deleteHall(id);
    }
}
