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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { SpeakerService } from './speaker.service';
import { CreateSpeakerDto } from './dto/create-speaker.dto';
import { UpdateSpeakerDto } from './dto/update-speaker.dto';
import logger from '../../../logger';

@ApiTags('Speakers')
@Controller('speakers')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class SpeakerController {
    constructor(private readonly speakerService: SpeakerService) {}

    private successResponse(data: any, message?: string) {
        return { status: 'success', data, message: message || null };
    }

    private failResponse(message: string) {
        return { status: 'fail', data: [], message };
    }

    @Get()
    @ApiOperation({ summary: 'Get list of speakers' })
    async index(@Query('per_page') perPage: number, @Res() res: Response) {
        try {
            const speakers = await this.speakerService.getSpeakers(perPage);
            return res.status(HttpStatus.OK).json(this.successResponse(speakers));
        } catch (error) {
            logger.error('Error fetching speakers:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }

    @Post()
    @ApiOperation({ summary: 'Create a new speaker' })
    async store(@Body(new ValidationPipe()) createSpeakerDto: CreateSpeakerDto, @Res() res: Response) {
        try {
            const speaker = await this.speakerService.createSpeaker(createSpeakerDto);
            return res.status(HttpStatus.CREATED).json(this.successResponse(speaker, 'Speaker created successfully.'));
        } catch (error) {
            logger.error('Error creating speaker:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }
}
