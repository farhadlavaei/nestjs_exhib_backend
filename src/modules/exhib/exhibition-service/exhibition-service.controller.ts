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
import { ExhibitionServiceService } from './exhibition-service.service';
import { CreateExhibitionServiceDto } from './dto/create-exhibition-service.dto';
import { UpdateExhibitionServiceDto } from './dto/update-exhibition-service.dto';
import logger from '../../../logger';

@ApiTags('Exhibition Services')
@Controller('exhibition_service')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class ExhibitionServiceController {
    constructor(private readonly serviceService: ExhibitionServiceService) {}

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
    @ApiOperation({ summary: 'Get list of exhibition services' })
    @ApiResponse({ status: 200, description: 'Exhibition services retrieved successfully.' })
    async index(@Query('per_page') perPage: number) {
        try {
            const services = await this.serviceService.getServices(perPage);
            return this.successResponse(services, 'Exhibition services retrieved successfully');
        } catch (error) {
            logger.error('Error fetching exhibition services:', error);
            return this.failResponse('Failed to retrieve exhibition services');
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific exhibition service' })
    @ApiResponse({ status: 200, description: 'Exhibition service retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Exhibition service not found.' })
    async show(@Param('id', ParseIntPipe) id: number) {
        try {
            const service = await this.serviceService.getServiceById(id);
            if (!service) throw new NotFoundException('Exhibition service not found.');
            return this.successResponse(service, 'Exhibition service retrieved successfully');
        } catch (error) {
            logger.error('Error fetching exhibition service:', error);
            return this.failResponse('Failed to fetch exhibition service');
        }
    }

    @Post()
    @ApiOperation({ summary: 'Create a new exhibition service' })
    @ApiResponse({ status: 201, description: 'Exhibition service created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid data.' })
    @ApiBody({ type: CreateExhibitionServiceDto })
    async store(@Body(new ValidationPipe()) createDto: CreateExhibitionServiceDto) {
        try {
            const service = await this.serviceService.createService(createDto);
            return this.successResponse(service, 'Exhibition service created successfully');
        } catch (error) {
            logger.error('Error creating exhibition service:', error);
            return this.failResponse('Failed to create exhibition service');
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an exhibition service' })
    @ApiResponse({ status: 200, description: 'Exhibition service updated successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid data.' })
    @ApiResponse({ status: 404, description: 'Exhibition service not found.' })
    @ApiBody({ type: UpdateExhibitionServiceDto })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) updateDto: UpdateExhibitionServiceDto
    ) {
        try {
            const updatedService = await this.serviceService.updateService(id, updateDto);
            return this.successResponse(updatedService, 'Exhibition service updated successfully');
        } catch (error) {
            logger.error('Error updating exhibition service:', error);
            if (error instanceof NotFoundException) return this.failResponse('Exhibition service not found');
            return this.failResponse('Failed to update exhibition service');
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an exhibition service' })
    @ApiResponse({ status: 204, description: 'Exhibition service deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Exhibition service not found.' })
    async destroy(@Param('id', ParseIntPipe) id: number) {
        try {
            await this.serviceService.deleteService(id);
            return this.successResponse(null, 'Exhibition service deleted successfully');
        } catch (error) {
            logger.error('Error deleting exhibition service:', error);
            if (error instanceof NotFoundException) return this.failResponse('Exhibition service not found');
            return this.failResponse('Failed to delete exhibition service');
        }
    }
}
