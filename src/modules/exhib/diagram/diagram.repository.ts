import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Diagram } from './entities/diagram.entity';
import logger from '../../../logger';
import { CreateDiagramDto } from './dto/create-diagram.dto';
import { UpdateDiagramDto } from './dto/update-diagram.dto';

@Injectable()
export class DiagramRepository extends Repository<Diagram> {
    constructor(private readonly dataSource: DataSource) {
        super(Diagram, dataSource.createEntityManager());
    }

    /**
     * Retrieve a list of diagrams associated with a specific user.
     * @param perPage Number of diagrams to retrieve per request.
     * @param userId The ID of the user retrieving the diagrams.
     */
    async getDiagrams(perPage: number = 10, userId: number): Promise<Diagram[]> {
        try {
            return await this.createQueryBuilder('diagram')
                .leftJoinAndSelect('diagram.user', 'user')
                .where('user.id = :userId', { userId }) // Properly filter by user ID
                .orderBy('diagram.created_at', 'DESC')
                .take(perPage)
                .getMany();
        } catch (error) {
            logger.error('Error retrieving diagrams list:', error);
            throw new InternalServerErrorException('Failed to retrieve diagrams.');
        }
    }


    /**
     * Retrieve a specific diagram by ID.
     * @param id The ID of the diagram.
     * @param userId The ID of the user requesting the diagram.
     */
    async getDiagramById(id: number, userId: number): Promise<Diagram> {
        try {
            const diagram = await this.createQueryBuilder('diagram')
                .leftJoinAndSelect('diagram.user', 'user')
                .where('diagram.id = :id', { id })
                .andWhere('user.id = :userId', { userId }) // Ensure the diagram belongs to the user
                .getOne();

            if (!diagram) {
                throw new NotFoundException(`Diagram with ID ${id} not found.`);
            }

            return diagram;
        } catch (error) {
            logger.error(`Error retrieving diagram with ID ${id}:`, error);
            throw new InternalServerErrorException('Failed to retrieve diagram.');
        }
    }


    /**
     * Create a new diagram.
     * @param data Data for creating the diagram.
     * @param userId The ID of the user creating the diagram.
     */
    async createDiagram(data: CreateDiagramDto, userId: number): Promise<Diagram> {
        try {
            const diagram = this.create({ ...data, user: { id: userId } as any }); // Assign user relation
            return await this.save(diagram);
        } catch (error) {
            logger.error('Error creating diagram:', error);
            throw new InternalServerErrorException('Failed to create diagram.');
        }
    }

    /**
     * Update an existing diagram.
     * @param id The ID of the diagram to update.
     * @param data Data for updating the diagram.
     * @param userId The ID of the user updating the diagram.
     */
    async updateDiagram(id: number, data: UpdateDiagramDto, userId: number): Promise<Diagram> {
        try {
            const diagram = await this.getDiagramById(id, userId);
            Object.assign(diagram, data);
            return await this.save(diagram);
        } catch (error) {
            logger.error(`Error updating diagram with ID ${id}:`, error);
            throw new InternalServerErrorException('Failed to update diagram.');
        }
    }

    /**
     * Delete a diagram.
     * @param id The ID of the diagram to delete.
     * @param userId The ID of the user deleting the diagram.
     */
    async deleteDiagram(id: number, userId: number) {
        try {
            const diagram = await this.getDiagramById(id, userId);
            return await this.remove(diagram);
        } catch (error) {
            logger.error(`Error deleting diagram with ID ${id}:`, error);
            throw new InternalServerErrorException('Failed to delete diagram.');
        }
    }
}
