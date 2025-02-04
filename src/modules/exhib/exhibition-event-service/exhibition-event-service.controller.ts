import { Controller, Post, Delete, Param, Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ExhibitionEventServiceService } from './exhibition-event-service.service';
import { AssociateServicesDto } from './dto/associate-services.dto';
import logger from '../../../logger';
import {DetachServicesDto} from "./dto/detach-service.dto";

@ApiTags('Exhibition Event Services')
@Controller('exhibition-events')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class ExhibitionEventServiceController {
    constructor(private readonly eventServiceService: ExhibitionEventServiceService) {}

    @Post(':eventId/services/attach')
    @ApiOperation({ summary: 'Attach services to an exhibition event' })
    @ApiResponse({ status: 201, description: 'Services attached successfully' })
    async attachServices(@Param('eventId') eventId: number, @Body(ValidationPipe) dto: AssociateServicesDto) {
        try {
            return await this.eventServiceService.attachServices(eventId, dto);
        } catch (error) {
            logger.error('Error attaching services:', error);
            throw error;
        }
    }

    @Delete(':eventId/services/detach')
    @ApiOperation({ summary: 'Detach services from an exhibition event' })
    @ApiResponse({ status: 200, description: 'Services detached successfully' })
    async detachServices(@Param('eventId') eventId: number, @Body(ValidationPipe) dto: DetachServicesDto) {
        try {
            return await this.eventServiceService.detachServices(eventId, dto);
        } catch (error) {
            logger.error('Error detaching services:', error);
            throw error;
        }
    }
}
