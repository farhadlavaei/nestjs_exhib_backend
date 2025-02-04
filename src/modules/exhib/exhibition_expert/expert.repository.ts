import { Repository, DataSource } from 'typeorm';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Expert } from './entities/expert.entity';
import { CreateExpertDto } from './dto/create-expert.dto';
import logger from '../../../logger';
import {ExhibitionEvent} from "../exhibition-event/entities/exhibition-event.entity";
import {User} from "../../user/entities/user.entity";

@Injectable()
export class ExpertRepository extends Repository<Expert> {
    constructor(private readonly dataSource: DataSource) {
        super(Expert, dataSource.createEntityManager());
    }

    /**
     * Attach an expert to an event.
     */
    async attachExpert(data: CreateExpertDto): Promise<Expert> {
        try {
            const event = await this.dataSource.getRepository(ExhibitionEvent).findOne({ where: { id: data.exhibition_id } });
            if (!event) throw new NotFoundException(`Event with ID ${data.exhibition_id} not found.`);

            const user = await this.dataSource.getRepository(User).findOne({ where: { id: data.user_id } });
            if (!user) throw new NotFoundException(`User with ID ${data.user_id} not found.`);

            const expert = this.create({ event, user });
            return await this.save(expert);
        } catch (error) {
            logger.error('Error attaching expert to event:', error);
            throw new InternalServerErrorException('Failed to attach expert.');
        }
    }

    /**
     * Detach an expert from an event.
     */
    async detachExpert(eventId: number, userId: number): Promise<void> {
        try {
            const expert = await this.findOne({ where: { event: { id: eventId }, user: { id: userId } } });

            if (!expert) throw new NotFoundException(`Expert with user ID ${userId} not found in event ID ${eventId}.`);

            await this.remove(expert);
        } catch (error) {
            logger.error('Error detaching expert from event:', error);
            throw new InternalServerErrorException('Failed to detach expert.');
        }
    }

    /**
     * Get list of experts for an event.
     */
    async listExperts(eventId: number): Promise<Expert[]> {
        try {
            return await this.createQueryBuilder('expert')
                .leftJoinAndSelect('expert.user', 'user')
                .where('expert.event.id = :eventId', { eventId })
                .getMany();
        } catch (error) {
            logger.error('Error retrieving experts list:', error);
            throw new InternalServerErrorException('Failed to retrieve experts.');
        }
    }
}
