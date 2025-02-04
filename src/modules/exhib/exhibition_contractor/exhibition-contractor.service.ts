import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExhibitionContractor } from './entities/exhibition-contractor.entity';
import { Repository } from 'typeorm';
import { AttachContractorDto } from './dto/attach-contractor.dto';
import { DetachContractorDto } from './dto/detach-contractor.dto';
import {ExhibitionEvent} from "../exhibition-event/entities/exhibition-event.entity";
import {Company} from "../company/entities/company.entity";

@Injectable()
export class ExhibitionContractorService {
    constructor(
        @InjectRepository(ExhibitionContractor)
        private readonly contractorRepository: Repository<ExhibitionContractor>,

        @InjectRepository(ExhibitionEvent)
        private readonly eventRepository: Repository<ExhibitionEvent>,

        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>
    ) {}

    async attachToEvent(dto: AttachContractorDto) {
        const event = await this.eventRepository.findOne({ where: { id: dto.exhibition_id } });
        if (!event) throw new NotFoundException('Exhibition event not found.');

        const company = await this.companyRepository.findOne({ where: { id: dto.company_id } });
        if (!company) throw new NotFoundException('Company not found.');

        const contractor = this.contractorRepository.create({ event, company });
        await this.contractorRepository.save(contractor);

        return await this.contractorRepository.find({ where: { event: dto.exhibition_id } } as any);
    }

    async detachFromEvent(dto: DetachContractorDto) {
        const contractor = await this.contractorRepository.findOne({ where: { event: dto.exhibition_id, company: dto.company_id } } as any);

        if (!contractor) throw new NotFoundException('Contractor not found.');

        await this.contractorRepository.remove(contractor);

        return await this.contractorRepository.find({ where: { event: dto.exhibition_id } } as any);
    }

    async listContractors(eventId: number) {
        return await this.contractorRepository.find({
            where: { event: eventId },
            relations: ['company']
        } as any);
    }
}
