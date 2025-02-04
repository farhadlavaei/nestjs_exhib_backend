import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ExhibitionEventServiceRepository } from './exhibition-event-service.repository';
import { AssociateServicesDto } from './dto/associate-services.dto';
import {DetachServicesDto} from "./dto/detach-service.dto";

@Injectable()
export class ExhibitionEventServiceService {
    constructor(private readonly eventServiceRepo: ExhibitionEventServiceRepository) {}

    /**
     * Attach services to an event.
     */
    async attachServices(eventId: number, dto: AssociateServicesDto) {
        try {
            return await this.eventServiceRepo.attachServices(eventId, dto.services);
        } catch (error) {
            throw new InternalServerErrorException('Failed to attach services.');
        }
    }

    /**
     * Detach services from an event.
     */
    async detachServices(eventId: number, dto: DetachServicesDto) {
        try {
            await this.eventServiceRepo.detachServices(eventId, dto.services);
            return { message: 'Services detached successfully' };
        } catch (error) {
            throw new InternalServerErrorException('Failed to detach services.');
        }
    }
}
