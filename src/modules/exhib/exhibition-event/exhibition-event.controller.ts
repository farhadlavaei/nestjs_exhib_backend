import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Req,
    Res,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ExhibitionEventService } from './exhibition-event.service';
import { CreateExhibitionEventDto } from './dto/create-exhibition-event.dto';
import { UpdateExhibitionEventDto } from './dto/update-exhibition-event.dto';
import { JwtPayload } from '../../auth/jwt.payload';
import logger from '../../../logger';

@ApiTags('Exhibition Events')
@Controller('exhibition_event')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class ExhibitionEventController {
    constructor(private readonly exhibitionEventService: ExhibitionEventService) {}

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

    @Get('/calendar')
    @ApiOperation({ summary: 'Get exhibition events calendar' })
    @ApiResponse({ status: 200, description: 'Exhibition events calendar retrieved successfully.' })
    async getCalendar(@Res() res: Response) {
        try {
            const exhibitions = await this.exhibitionEventService.getCalendar();
            return res.status(HttpStatus.OK).json(this.successResponse(exhibitions));
        } catch (error) {
            logger.error('Error fetching calendar:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }

    @Get()
    @ApiOperation({ summary: 'Get list of exhibition events' })
    @ApiResponse({ status: 200, description: 'Exhibition events retrieved successfully.' })
    async index(@Query('per_page') perPage: number, @Res() res: Response) {
        try {
            const events = await this.exhibitionEventService.getEvents(perPage);
            return res.status(HttpStatus.OK).json(this.successResponse(events));
        } catch (error) {
            logger.error('Error fetching exhibition events:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific exhibition event' })
    @ApiResponse({ status: 200, description: 'Exhibition event retrieved successfully.' })
    async show(@Param('id') id: number, @Res() res: Response) {
        try {
            const event = await this.exhibitionEventService.getEventById(id);
            return res.status(HttpStatus.OK).json(this.successResponse(event));
        } catch (error) {
            logger.error('Error fetching exhibition event:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }

    @Post()
    @ApiOperation({ summary: 'Create a new exhibition event' })
    @ApiResponse({ status: 201, description: 'Exhibition event created successfully.' })
    @ApiBody({ type: CreateExhibitionEventDto })
    async store(@Body(new ValidationPipe()) createExhibitionEventDto: CreateExhibitionEventDto, @Req() req: any, @Res() res: Response) {
        try {
            const user = req.user as JwtPayload;
            const event = await this.exhibitionEventService.createEvent(user.id, createExhibitionEventDto);
            return res.status(HttpStatus.CREATED).json(this.successResponse(event, 'Exhibition event created successfully.'));
        } catch (error) {
            logger.error('Error creating exhibition event:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an exhibition event' })
    @ApiResponse({ status: 200, description: 'Exhibition event updated successfully.' })
    @ApiBody({ type: UpdateExhibitionEventDto })
    async update(@Param('id') id: number, @Body() updateExhibitionEventDto: UpdateExhibitionEventDto, @Res() res: Response) {
        try {
            const updatedEvent = await this.exhibitionEventService.updateEvent(id, updateExhibitionEventDto);
            return res.status(HttpStatus.OK).json(this.successResponse(updatedEvent, 'Exhibition event updated successfully.'));
        } catch (error) {
            logger.error('Error updating exhibition event:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an exhibition event' })
    @ApiResponse({ status: 204, description: 'Exhibition event deleted successfully.' })
    async destroy(@Param('id') id: number, @Res() res: Response) {
        try {
            await this.exhibitionEventService.deleteEvent(id);
            return res.status(HttpStatus.NO_CONTENT).send();
        } catch (error) {
            logger.error('Error deleting exhibition event:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }
}
