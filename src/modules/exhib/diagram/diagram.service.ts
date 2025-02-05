import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DiagramRepository } from './diagram.repository';
import { CreateDiagramDto } from './dto/create-diagram.dto';
import { UpdateDiagramDto } from './dto/update-diagram.dto';
import logger from '../../../logger';

/**
 * Service layer for managing diagrams.
 * This service ensures error handling, authorization checks, and data flow validation.
 */
@Injectable()
export class DiagramService {
    constructor(private readonly diagramRepository: DiagramRepository) {}

    /**
     * Retrieves a list of diagrams for a specific user.
     *
     * @param perPage - The number of diagrams per request.
     * @param userId - The ID of the user requesting diagrams.
     * @returns A list of diagrams owned by the user.
     * @throws InternalServerErrorException if retrieval fails.
     */
    async getDiagrams(perPage: number, userId: number) {
        try {
            return await this.diagramRepository.getDiagrams(perPage, userId);
        } catch (error) {
            logger.error('Error retrieving diagrams:', error);
            throw new InternalServerErrorException('Failed to retrieve diagrams.');
        }
    }

    /**
     * Retrieves a specific diagram by ID.
     *
     * @param id - The ID of the diagram.
     * @param userId - The ID of the user requesting the diagram.
     * @returns The requested diagram if found and authorized.
     * @throws NotFoundException if the diagram does not exist.
     * @throws UnauthorizedException if the user is not the owner.
     * @throws InternalServerErrorException if retrieval fails.
     */
    async getDiagramById(id: number, userId: number) {
        try {
            const diagram = await this.diagramRepository.getDiagramById(id, userId);
            return diagram;
        } catch (error) {
            logger.error(`Error retrieving diagram with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Creates a new diagram.
     *
     * @param createDiagramDto - DTO containing diagram details.
     * @param userId - The ID of the user creating the diagram.
     * @returns The newly created diagram.
     * @throws InternalServerErrorException if creation fails.
     */
    async createDiagram(createDiagramDto: CreateDiagramDto, userId: number) {
        try {
            return await this.diagramRepository.createDiagram(createDiagramDto, userId);
        } catch (error) {
            logger.error('Error creating diagram:', error);
            throw new InternalServerErrorException('Failed to create diagram.');
        }
    }

    /**
     * Updates an existing diagram.
     *
     * @param id - The ID of the diagram to update.
     * @param updateDiagramDto - DTO containing updated diagram details.
     * @param userId - The ID of the user updating the diagram.
     * @returns The updated diagram.
     * @throws NotFoundException if the diagram does not exist.
     * @throws UnauthorizedException if the user is not the owner.
     * @throws InternalServerErrorException if update fails.
     */
    async updateDiagram(id: number, updateDiagramDto: UpdateDiagramDto, userId: number) {
        try {
            await this.getDiagramById(id, userId);
            return await this.diagramRepository.updateDiagram(id, updateDiagramDto, userId);
        } catch (error) {
            logger.error(`Error updating diagram with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Deletes a diagram.
     *
     * @param id - The ID of the diagram to delete.
     * @param userId - The ID of the user deleting the diagram.
     * @returns A confirmation of deletion.
     * @throws NotFoundException if the diagram does not exist.
     * @throws UnauthorizedException if the user is not the owner.
     * @throws InternalServerErrorException if deletion fails.
     */
    async deleteDiagram(id: number, userId: number) {
        try {
            await this.getDiagramById(id, userId);
            return await this.diagramRepository.deleteDiagram(id, userId);
        } catch (error) {
            logger.error(`Error deleting diagram with ID ${id}:`, error);
            throw error;
        }
    }
}
