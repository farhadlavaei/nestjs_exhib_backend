import { Repository, DataSource } from 'typeorm';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ExhibitionEventService } from './entities/exhibition-event-service.entity';
import { ExhibitionEvent } from '../exhibition-event/entities/exhibition-event.entity';
import { ExhibitionService } from '../exhibition-service/entities/exhibition-service.entity';
import logger from '../../../logger';

@Injectable()
export class ExhibitionEventServiceRepository extends Repository<ExhibitionEventService> {
    constructor(private readonly dataSource: DataSource) {
        super(ExhibitionEventService, dataSource.createEntityManager());
    }

    /**
     * Attach multiple services to an event.
     */
    async attachServices(eventId: number, serviceIds: number[]): Promise<ExhibitionEventService[]> {
        try {
            const event = await this.dataSource.getRepository(ExhibitionEvent).findOne({ where: { id: eventId } });
            if (!event) throw new NotFoundException(`Exhibition event with ID ${eventId} not found.`);

            const services = await this.dataSource.getRepository(ExhibitionService).findByIds(serviceIds);
            if (services.length !== serviceIds.length) throw new NotFoundException(`One or more services not found.`);

            const existingRecords = await this.find({ where: { event: eventId, service: serviceIds } } as any);

            const newRecords = serviceIds
                .filter(id => !existingRecords.some(record => record.service.id === id))
                .map(serviceId => this.create({ event, service: { id: serviceId } }));

            return await this.save(newRecords);
        } catch (error) {
            logger.error('Error attaching services:', error);
            throw new InternalServerErrorException('Failed to attach services.');
        }
    }

    /**
     * Detach services from an event.
     */
    async detachServices(eventId: number, serviceIds: number[]) {
        try {
            await this.createQueryBuilder()
                .delete()
                .from(ExhibitionEventService)
                .where('exhibition_event_id = :eventId', { eventId })
                .andWhere('exhibition_service_id IN (:...serviceIds)', { serviceIds })
                .execute();
        } catch (error) {
            logger.error('Error detaching services:', error);
            throw new InternalServerErrorException('Failed to detach services.');
        }
    }
}
