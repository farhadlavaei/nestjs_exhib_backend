import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
    BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import logger from '../../../logger';

@Injectable()
export class LocationService {
    constructor(
        @InjectRepository(Location)
        private readonly locationRepository: Repository<Location>,
    ) {}

    /**
     * Retrieve a paginated list of locations.
     * @param perPage - Number of locations per page.
     */
    async getLocations(perPage: number) {
        try {
            return await this.locationRepository.find({
                take: perPage || 10,
                order: { id: 'DESC' },
            });
        } catch (error) {
            logger.error('Error retrieving locations:', error);
            throw new InternalServerErrorException('Failed to fetch locations.');
        }
    }

    /**
     * Retrieve a single location by ID.
     * @param id - Location ID
     */
    async getLocationById(id: number): Promise<Location> {
        try {
            const location = await this.locationRepository.findOne({ where: { id } });
            if (!location) {
                throw new NotFoundException(`Location with ID ${id} not found.`);
            }
            return location;
        } catch (error) {
            logger.error(`Error retrieving location with ID ${id}:`, error);
            throw new InternalServerErrorException('Failed to fetch location.');
        }
    }

    /**
     * Create a new location.
     * @param createLocationDto - Data transfer object for location creation.
     */
    async createLocation(createLocationDto: CreateLocationDto) {
        try {
            console.log('Received DTO:', createLocationDto); // Log incoming data

            const location = this.locationRepository.create({
                ...createLocationDto,
                created_at: new Date(),
                updated_at: new Date(),
            });

            const savedLocation = await this.locationRepository.save(location);
            console.log('Saved Location:', savedLocation); // Log saved data

            return savedLocation;
        } catch (error) {
            throw new InternalServerErrorException('Error creating location', error.message);
        }
    }


    /**
     * Update an existing location.
     * @param id - Location ID
     * @param updateLocationDto - Data transfer object for location update.
     */
    async updateLocation(id: number, updateLocationDto: UpdateLocationDto): Promise<Location> {
        try {
            const location = await this.getLocationById(id);
            Object.assign(location, updateLocationDto);
            return await this.locationRepository.save(location);
        } catch (error) {
            logger.error(`Error updating location with ID ${id}:`, error);
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to update location.');
        }
    }

    /**
     * Delete a location (soft delete).
     * @param id - Location ID
     */
    async deleteLocation(id: number): Promise<void> {
        try {
            const location = await this.getLocationById(id);
            await this.locationRepository.softRemove(location);
        } catch (error) {
            logger.error(`Error deleting location with ID ${id}:`, error);
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to delete location.');
        }
    }
}
