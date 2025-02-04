import { Repository, DataSource } from 'typeorm';
import { ExhibitionContractor } from './entities/exhibition-contractor.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class ExhibitionContractorRepository extends Repository<ExhibitionContractor> {
    constructor(private readonly dataSource: DataSource) {
        super(ExhibitionContractor, dataSource.createEntityManager());
    }

    async getContractorsByEvent(eventId: number) {
        try {
            return await this.createQueryBuilder('contractor')
                .leftJoinAndSelect('contractor.company', 'company')
                .where('contractor.event_id = :eventId', { eventId })
                .getMany();
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve contractors.');
        }
    }
}
