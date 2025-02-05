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
    InternalServerErrorException,
    Req
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DiagramService } from './diagram.service';
import { CreateDiagramDto } from './dto/create-diagram.dto';
import { UpdateDiagramDto } from './dto/update-diagram.dto';
import logger from '../../../logger';

@ApiTags('Diagrams')
@Controller('diagrams')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class DiagramController {
    constructor(private readonly diagramService: DiagramService) {}

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
    @ApiOperation({ summary: 'Get list of diagrams' })
    @ApiResponse({ status: 200, description: 'Diagrams retrieved successfully.' })
    async index(@Query('per_page') perPage: number, @Req() req) {
        try {
            const userId = req.user.id;
            const diagrams = await this.diagramService.getDiagrams(perPage, userId);
            return this.successResponse(diagrams, 'Diagrams retrieved successfully');
        } catch (error) {
            logger.error('Error fetching diagrams:', error);
            return this.failResponse('Failed to retrieve diagrams');
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific diagram' })
    @ApiResponse({ status: 200, description: 'Diagram retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Diagram not found.' })
    async show(@Param('id', ParseIntPipe) id: number, @Req() req) {
        try {
            const userId = req.user.id;
            const diagram = await this.diagramService.getDiagramById(id, userId);
            if (!diagram) throw new NotFoundException('Diagram not found.');
            return this.successResponse(diagram, 'Diagram retrieved successfully');
        } catch (error) {
            logger.error('Error fetching diagram:', error);
            return this.failResponse('Failed to fetch diagram');
        }
    }

    @Post()
    @ApiOperation({ summary: 'Create a new diagram' })
    @ApiResponse({ status: 201, description: 'Diagram created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid data.' })
    @ApiBody({ type: CreateDiagramDto })
    async store(@Body(new ValidationPipe()) createDiagramDto: CreateDiagramDto, @Req() req) {
        try {
            const userId = req.user.id;
            const diagram = await this.diagramService.createDiagram(createDiagramDto, userId);
            return this.successResponse(diagram, 'Diagram created successfully');
        } catch (error) {
            logger.error('Error creating diagram:', error);
            return this.failResponse('Failed to create diagram');
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a diagram' })
    @ApiResponse({ status: 200, description: 'Diagram updated successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid data.' })
    @ApiResponse({ status: 404, description: 'Diagram not found.' })
    @ApiBody({ type: UpdateDiagramDto })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) updateDiagramDto: UpdateDiagramDto,
        @Req() req
    ) {
        try {
            const userId = req.user.id;
            const updatedDiagram = await this.diagramService.updateDiagram(id, updateDiagramDto, userId);
            return this.successResponse(updatedDiagram, 'Diagram updated successfully');
        } catch (error) {
            logger.error('Error updating diagram:', error);
            if (error instanceof NotFoundException) return this.failResponse('Diagram not found');
            return this.failResponse('Failed to update diagram');
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a diagram' })
    @ApiResponse({ status: 204, description: 'Diagram deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Diagram not found.' })
    async destroy(@Param('id', ParseIntPipe) id: number, @Req() req) {
        try {
            const userId = req.user.id;
            await this.diagramService.deleteDiagram(id, userId);
            return this.successResponse(null, 'Diagram deleted successfully');
        } catch (error) {
            logger.error('Error deleting diagram:', error);
            if (error instanceof NotFoundException) return this.failResponse('Diagram not found');
            return this.failResponse('Failed to delete diagram');
        }
    }
}
