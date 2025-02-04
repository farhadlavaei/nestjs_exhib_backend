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
    HttpStatus,
    NotFoundException,
    ParseIntPipe,
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
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import logger from '../../../logger';

@ApiTags('Locations')
@Controller('locations')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class LocationController {
    constructor(private readonly locationService: LocationService) {}

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
    @ApiOperation({ summary: 'Get list of locations' })
    @ApiResponse({ status: 200, description: 'Locations retrieved successfully.' })
    async index(@Query('per_page') perPage: number) {
        try {
            const locations = await this.locationService.getLocations(perPage);
            return this.successResponse(locations, 'Locations retrieved successfully');
        } catch (error) {
            logger.error('Error fetching locations:', error);
            return this.failResponse('Failed to retrieve locations');
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific location' })
    @ApiResponse({ status: 200, description: 'Location retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Location not found.' })
    async show(@Param('id', ParseIntPipe) id: number) {
        try {
            const location = await this.locationService.getLocationById(id);
            if (!location) throw new NotFoundException('Location not found.');
            return this.successResponse(location, 'Location retrieved successfully');
        } catch (error) {
            logger.error('Error fetching location:', error);
            return this.failResponse('Failed to fetch location');
        }
    }

    @Post()
    @ApiOperation({ summary: 'Create a new location' })
    @ApiResponse({ status: 201, description: 'Location created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid data.' })
    @ApiBody({ type: CreateLocationDto })
    async store(@Body(new ValidationPipe()) createLocationDto: CreateLocationDto) {
        try {
            const location = await this.locationService.createLocation(createLocationDto);
            return this.successResponse(location, 'Location created successfully');
        } catch (error) {
            logger.error('Error creating location:', error);
            return this.failResponse('Failed to create location');
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a location' })
    @ApiResponse({ status: 200, description: 'Location updated successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid data.' })
    @ApiResponse({ status: 404, description: 'Location not found.' })
    @ApiBody({ type: UpdateLocationDto })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) updateLocationDto: UpdateLocationDto
    ) {
        try {
            const updatedLocation = await this.locationService.updateLocation(id, updateLocationDto);
            return this.successResponse(updatedLocation, 'Location updated successfully');
        } catch (error) {
            logger.error('Error updating location:', error);
            if (error instanceof NotFoundException) return this.failResponse('Location not found');
            return this.failResponse('Failed to update location');
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a location' })
    @ApiResponse({ status: 204, description: 'Location deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Location not found.' })
    async destroy(@Param('id', ParseIntPipe) id: number) {
        try {
            await this.locationService.deleteLocation(id);
            return this.successResponse(null, 'Location deleted successfully');
        } catch (error) {
            logger.error('Error deleting location:', error);
            if (error instanceof NotFoundException) return this.failResponse('Location not found');
            return this.failResponse('Failed to delete location');
        }
    }
}
