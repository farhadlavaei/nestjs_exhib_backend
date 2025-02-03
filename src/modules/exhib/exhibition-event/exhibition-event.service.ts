import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExhibitionEvent } from './entities/exhibition-event.entity';
import { CreateExhibitionEventDto } from './dto/create-exhibition-event.dto';
import { UpdateExhibitionEventDto } from './dto/update-exhibition-event.dto';
import {User} from "../../user/entities/user.entity";
import {Company} from "../company/entities/company.entity";

@Injectable()
export class ExhibitionEventService {
    constructor(
        @InjectRepository(ExhibitionEvent)
        private readonly exhibitionEventRepository: Repository<ExhibitionEvent>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
    ) {}

    async getEvents(perPage: number) {
        return await this.exhibitionEventRepository.find({ relations: ['organizer', 'company'] });
    }

    async getEventById(id: number) {
        const event = await this.exhibitionEventRepository.findOne({ where: { id }, relations: ['organizer', 'company'] });
        if (!event) {
            throw new NotFoundException('Event not found.');
        }
        return event;
    }

    async createEvent(userId: number, dto: CreateExhibitionEventDto) {
        console.log('company_id ::', dto);
        const user = await this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.companies', 'company')
            .where('user.id = :userId', { userId })
            .getOne();

        if (!user || !user.companies || user.companies.length === 0) {
            throw new NotFoundException('User does not belong to any company.');
        }

        const company = await this.companyRepository.findOne({
            where: { id: dto.company_id },
        });

        if (!company) {
            throw new NotFoundException('Company not found.');
        }

        const event = this.exhibitionEventRepository.create(dto);

        console.log('Created Event :::', event);

        const savedEvent = await this.exhibitionEventRepository.save(event);

        console.log('Saved Event :::: ', savedEvent);
        /*if (!savedEvent.id) {
            throw new Error('Event ID is missing after saving.');
        }*/
        return savedEvent;
    }



    async updateEvent(id: number, dto: UpdateExhibitionEventDto) {
        await this.exhibitionEventRepository.update(id, dto);
        return await this.getEventById(id);
    }

    async deleteEvent(id: number) {
        const result = await this.exhibitionEventRepository.delete(id);
        if (!result.affected) {
            throw new NotFoundException('Event not found.');
        }
        return { message: 'Event deleted successfully.' };
    }

    async getCalendar() {
        return await this.exhibitionEventRepository.find();
    }
}
