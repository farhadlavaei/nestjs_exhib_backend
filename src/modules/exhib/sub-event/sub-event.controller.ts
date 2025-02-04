import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Query,
    Res,
    UseGuards,
    ValidationPipe,
    HttpStatus,
    NotFoundException
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { SubEventService } from './sub-event.service';
import { CreateSubEventDto } from './dto/create-sub-event.dto';
import { UpdateSubEventDto } from './dto/update-sub-event.dto';
import logger from '../../../logger';

@ApiTags('Sub Events')
@Controller('sub-events')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class SubEventController {
    constructor(private readonly subEventService: SubEventService) {}

    private successResponse(data: any, message?: string) {
        return {
            status: 'success',
            data: data || [],
            message: message || null,
        };
    }

    private failResponse(message: string) {
        return {
            status: 'fail',
            data: [],
            message,
        };
    }

    @Get()
    @ApiOperation({ summary: 'Get list of sub-events' })
    @ApiResponse({ status: 200, description: 'Sub-events retrieved successfully.' })
    async index(@Query('per_page') perPage: number, @Res() res: Response) {
        try {
            const subEvents = await this.subEventService.getSubEvents(perPage);
            return res.status(HttpStatus.OK).json(this.successResponse(subEvents));
        } catch (error) {
            logger.error('Error fetching sub-events:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific sub-event' })
    @ApiResponse({ status: 200, description: 'Sub-event retrieved successfully.' })
    async show(@Param('id') id: number, @Res() res: Response) {
        try {
            const subEvent = await this.subEventService.getSubEventById(id);
            if (!subEvent) throw new NotFoundException('Sub-event not found.');
            return res.status(HttpStatus.OK).json(this.successResponse(subEvent));
        } catch (error) {
            logger.error('Error fetching sub-event:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }

    @Post()
    @ApiOperation({ summary: 'Create a new sub-event' })
    @ApiResponse({ status: 201, description: 'Sub-event created successfully.' })
    @ApiBody({ type: CreateSubEventDto })
    async store(
        @Body(new ValidationPipe()) createSubEventDto: CreateSubEventDto,
        @Res() res: Response
    ) {
        try {
            const subEvent = await this.subEventService.createSubEvent(createSubEventDto);
            return res.status(HttpStatus.CREATED).json(this.successResponse(subEvent, 'Sub-event created successfully.'));
        } catch (error) {
            logger.error('Error creating sub-event:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a sub-event' })
    @ApiResponse({ status: 200, description: 'Sub-event updated successfully.' })
    @ApiBody({ type: UpdateSubEventDto })
    async update(
        @Param('id') id: number,
        @Body(new ValidationPipe()) updateSubEventDto: UpdateSubEventDto,
        @Res() res: Response
    ) {
        try {
            const updatedSubEvent = await this.subEventService.updateSubEvent(id, updateSubEventDto);
            return res.status(HttpStatus.OK).json(this.successResponse(updatedSubEvent, 'Sub-event updated successfully.'));
        } catch (error) {
            logger.error('Error updating sub-event:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a sub-event' })
    @ApiResponse({ status: 204, description: 'Sub-event deleted successfully.' })
    async destroy(@Param('id') id: number, @Res() res: Response) {
        try {
            await this.subEventService.deleteSubEvent(id);
            return res.status(HttpStatus.NO_CONTENT).send();
        } catch (error) {
            logger.error('Error deleting sub-event:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }
}
