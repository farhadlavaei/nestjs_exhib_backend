import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Query,
    ParseIntPipe,
    UseGuards,
    ValidationPipe,
    NotFoundException,
    InternalServerErrorException
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ExhibitionHallService } from './exhibition-hall.service';
import { CreateExhibitionHallDto } from './dto/create-exhibition-hall.dto';
import { UpdateExhibitionHallDto } from './dto/update-exhibition-hall.dto';
import logger from '../../../logger';

@ApiTags('Exhibition Halls')
@Controller('exhibition-halls')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class ExhibitionHallController {
    constructor(private readonly hallService: ExhibitionHallService) {}

    private successResponse(data: any, message?: string) {
        return { status: 'success', data: data || [], message: message || null };
    }

    private failResponse(message: string) {
        return { status: 'fail', data: [], message };
    }

    @Get()
    @ApiOperation({ summary: 'Get list of exhibition halls' })
    @ApiResponse({ status: 200, description: 'Exhibition halls retrieved successfully.' })
    async index() {
        try {
            const halls = await this.hallService.getHalls();
            return this.successResponse(halls, 'Exhibition halls retrieved successfully');
        } catch (error) {
            logger.error('Error fetching exhibition halls:', error);
            return this.failResponse('Failed to retrieve exhibition halls');
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific exhibition hall' })
    async show(@Param('id', ParseIntPipe) id: number) {
        try {
            const hall = await this.hallService.getHallById(id);
            if (!hall) throw new NotFoundException('Exhibition hall not found.');
            return this.successResponse(hall, 'Exhibition hall retrieved successfully');
        } catch (error) {
            return this.failResponse('Failed to retrieve exhibition hall');
        }
    }

    @Post()
    @ApiOperation({ summary: 'Create a new exhibition hall' })
    async store(@Body(new ValidationPipe()) createHallDto: CreateExhibitionHallDto) {
        return this.hallService.createHall(createHallDto);
    }
}
