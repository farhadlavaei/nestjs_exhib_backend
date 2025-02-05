import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Query,
    UseGuards,
    ValidationPipe,
    ParseIntPipe,
    NotFoundException
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ExhibitionBoothService } from './exhibition-booth.service';
import { CreateExhibitionBoothDto } from './dto/create-exhibition-booth.dto';
import { UpdateExhibitionBoothDto } from './dto/update-exhibition-booth.dto';
import logger from '../../../logger';

@ApiTags('Exhibition Booths')
@Controller('exhibition-booths')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class ExhibitionBoothController {
    constructor(private readonly exhibitionBoothService: ExhibitionBoothService) {}

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
    @ApiOperation({ summary: 'Get list of exhibition booths' })
    @ApiResponse({ status: 200, description: 'Booths retrieved successfully.' })
    async index(@Query('per_page') perPage: number) {
        try {
            const booths = await this.exhibitionBoothService.getBooths(perPage);
            return this.successResponse(booths, 'Booths retrieved successfully');
        } catch (error) {
            logger.error('Error fetching booths:', error);
            return this.failResponse('Failed to retrieve booths');
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific booth' })
    @ApiResponse({ status: 200, description: 'Booth retrieved successfully.' })
    async show(@Param('id', ParseIntPipe) id: number) {
        try {
            const booth = await this.exhibitionBoothService.getBoothById(id);
            if (!booth) throw new NotFoundException('Booth not found.');
            return this.successResponse(booth, 'Booth retrieved successfully');
        } catch (error) {
            logger.error('Error fetching booth:', error);
            return this.failResponse('Failed to fetch booth');
        }
    }

    @Post()
    @ApiOperation({ summary: 'Create a new booth' })
    @ApiBody({ type: CreateExhibitionBoothDto })
    async store(@Body(new ValidationPipe()) createBoothDto: CreateExhibitionBoothDto) {
        try {
            const booth = await this.exhibitionBoothService.createBooth(createBoothDto);
            return this.successResponse(booth, 'Booth created successfully');
        } catch (error) {
            logger.error('Error creating booth:', error);
            return this.failResponse('Failed to create booth');
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a booth' })
    @ApiBody({ type: UpdateExhibitionBoothDto })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) updateBoothDto: UpdateExhibitionBoothDto
    ) {
        try {
            const updatedBooth = await this.exhibitionBoothService.updateBooth(id, updateBoothDto);
            return this.successResponse(updatedBooth, 'Booth updated successfully');
        } catch (error) {
            logger.error('Error updating booth:', error);
            return this.failResponse('Failed to update booth');
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a booth' })
    async destroy(@Param('id', ParseIntPipe) id: number) {
        try {
            await this.exhibitionBoothService.deleteBooth(id);
            return this.successResponse(null, 'Booth deleted successfully');
        } catch (error) {
            logger.error('Error deleting booth:', error);
            return this.failResponse('Failed to delete booth');
        }
    }
}
