import { Injectable } from '@nestjs/common';
import { ExpertRepository } from './expert.repository';
import { CreateExpertDto } from './dto/create-expert.dto';

@Injectable()
export class ExpertService {
    constructor(private readonly expertRepository: ExpertRepository) {}

    async attachExpert(data: CreateExpertDto) {
        return this.expertRepository.attachExpert(data);
    }

    async detachExpert(eventId: number, userId: number) {
        return this.expertRepository.detachExpert(eventId, userId);
    }

    async listExperts(eventId: number) {
        return this.expertRepository.listExperts(eventId);
    }
}
