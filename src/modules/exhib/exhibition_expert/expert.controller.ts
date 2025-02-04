import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    HttpStatus,
    Res
} from '@nestjs/common';
import { ExpertService } from './expert.service';
import { CreateExpertDto } from './dto/create-expert.dto';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import logger from '../../../logger';

@ApiTags('Exhibition Experts')
@Controller('exhibition_expert')
export class ExpertController {
    constructor(private readonly expertService: ExpertService) {}

    private successResponse(data: any, message?: string) {
        return { status: 'success', data: data || [], message: message || null };
    }

    private failResponse(message: string) {
        return { status: 'fail', data: [], message };
    }

    @Post('/:event_id/attach')
    @ApiOperation({ summary: 'Attach an expert to an event' })
    @ApiResponse({ status: 201, description: 'Expert attached successfully.' })
    @ApiBody({ type: CreateExpertDto })
    async attachExpert(@Body() createExpertDto: CreateExpertDto, @Res() res: Response) {
        try {
            const expert = await this.expertService.attachExpert(createExpertDto);
            return res.status(HttpStatus.CREATED).json(this.successResponse(expert, 'Expert attached successfully.'));
        } catch (error) {
            logger.error('Error attaching expert:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }

    @Post('/:event_id/detach')
    @ApiOperation({ summary: 'Detach an expert from an event' })
    async detachExpert(@Param('event_id') eventId: number, @Body('user_id') userId: number, @Res() res: Response) {
        try {
            await this.expertService.detachExpert(eventId, userId);
            return res.status(HttpStatus.OK).json(this.successResponse(null, 'Expert detached successfully.'));
        } catch (error) {
            logger.error('Error detaching expert:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }

    @Get('/:event_id/experts')
    @ApiOperation({ summary: 'List all experts of an event' })
    async listExperts(@Param('event_id') eventId: number, @Res() res: Response) {
        try {
            const experts = await this.expertService.listExperts(eventId);
            return res.status(HttpStatus.OK).json(this.successResponse(experts));
        } catch (error) {
            logger.error('Error retrieving experts:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }
}
