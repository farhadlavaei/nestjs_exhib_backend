import { Repository, DataSource } from 'typeorm';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Location } from './entities/location.entity';
import logger from '../../../logger';

@Injectable()
export class LocationRepository extends Repository<Location> {
    constructor(private readonly dataSource: DataSource) {
        super(Location, dataSource.createEntityManager());
    }

    /**
     * Retrieve a list of locations with pagination.
     * @param perPage Number of items per page (default: 10)
     */
    async getLocations(perPage: number = 10): Promise<Location[]> {
        try {
            return await this.createQueryBuilder('location')
                .orderBy('location.created_at', 'DESC')
                .take(perPage)
                .getMany();
        } catch (error) {
            logger.error('Error retrieving locations list:', error);
            throw new InternalServerErrorException('Failed to retrieve locations.');
        }
    }

    /**
     * Retrieve a specific location by ID.
     * @param id Location ID
     */
    async getLocationById(id: number): Promise<Location> {
        try {
            const location = await this.createQueryBuilder('location')
                .where('location.id = :id', { id })
                .getOne();

            if (!location) {
                throw new NotFoundException(`Location with ID ${id} not found.`);
            }
            return location;
        } catch (error) {
            logger.error(`Error retrieving location with ID ${id}:`, error);
            throw new InternalServerErrorException('Failed to retrieve location.');
        }
    }

    /**
     * Create a new location.
     * @param data Location details
     */
    async createLocation(data: Partial<Location>) {
        try {
            const location = this.create({
                ...data,
                created_at: new Date(),
                updated_at: new Date(),
            });
            return await this.save(location);
        } catch (error) {
            throw new InternalServerErrorException('Error creating a new location', error.message);
        }
    }


    /**
     * Update an existing location.
     * @param id Location ID
     * @param data Updated location details
     */
    async updateLocation(id: number, data: Partial<Location>) {
        try {
            const location = await this.getLocationById(id);
            if (!location) throw new NotFoundException(`Location with ID ${id} not found.`);

            // Ensure updated_at is updated
            await this.update(id, { ...data, updated_at: new Date() });
            return await this.getLocationById(id);
        } catch (error) {
            throw new InternalServerErrorException(`Error updating location with ID ${id}`, error.message);
        }
    }


    /**
     * Delete a location (soft delete).
     * @param id Location ID
     */
    async deleteLocation(id: number) {
        try {
            const location = await this.getLocationById(id);
            if (!location) throw new NotFoundException(`Location with ID ${id} not found.`);

            // Perform soft delete
            await this.update(id, { deleted_at: new Date() });

            return location;
        } catch (error) {
            throw new InternalServerErrorException(`Error deleting location with ID ${id}`, error.message);
        }
    }

}
