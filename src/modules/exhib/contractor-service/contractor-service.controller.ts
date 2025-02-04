import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Res,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ContractorServiceService } from './contractor-service.service';
import { CreateContractorServiceDto } from './dto/create-contractor-service.dto';
import { UpdateContractorServiceDto } from './dto/update-contractor-service.dto';
import logger from '../../../logger';

@ApiTags('Contractor Services')
@Controller('contractor-services')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class ContractorServiceController {
    constructor(private readonly contractorServiceService: ContractorServiceService) {}

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
    @ApiOperation({ summary: 'Get list of contractor services' })
    @ApiResponse({ status: 200, description: 'Contractor services retrieved successfully.' })
    async index(@Query('per_page') perPage: number, @Res() res: Response) {
        try {
            const services = await this.contractorServiceService.getContractorServices(perPage);
            return res.status(HttpStatus.OK).json(this.successResponse(services));
        } catch (error) {
            logger.error('Error fetching contractor services:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific contractor service' })
    @ApiResponse({ status: 200, description: 'Contractor service retrieved successfully.' })
    async show(@Param('id') id: number, @Res() res: Response) {
        try {
            const service = await this.contractorServiceService.getContractorServiceById(id);
            return res.status(HttpStatus.OK).json(this.successResponse(service));
        } catch (error) {
            logger.error('Error fetching contractor service:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }

    @Post()
    @ApiOperation({ summary: 'Create a new contractor service' })
    @ApiResponse({ status: 201, description: 'Contractor service created successfully.' })
    @ApiBody({ type: CreateContractorServiceDto })
    async store(
        @Body(new ValidationPipe()) createContractorServiceDto: CreateContractorServiceDto,
        @Res() res: Response
    ) {
        try {
            const service = await this.contractorServiceService.createContractorService(createContractorServiceDto);
            return res.status(HttpStatus.CREATED).json(this.successResponse(service, 'Contractor service created successfully.'));
        } catch (error) {
            logger.error('Error creating contractor service:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a contractor service' })
    @ApiResponse({ status: 200, description: 'Contractor service updated successfully.' })
    @ApiBody({ type: UpdateContractorServiceDto })
    async update(
        @Param('id') id: number,
        @Body(new ValidationPipe()) updateContractorServiceDto: UpdateContractorServiceDto,
        @Res() res: Response
    ) {
        try {
            const updatedService = await this.contractorServiceService.updateContractorService(id, updateContractorServiceDto);
            return res.status(HttpStatus.OK).json(this.successResponse(updatedService, 'Contractor service updated successfully.'));
        } catch (error) {
            logger.error('Error updating contractor service:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a contractor service' })
    @ApiResponse({ status: 204, description: 'Contractor service deleted successfully.' })
    async destroy(@Param('id') id: number, @Res() res: Response) {
        try {
            await this.contractorServiceService.deleteContractorService(id);
            return res.status(HttpStatus.NO_CONTENT).send();
        } catch (error) {
            logger.error('Error deleting contractor service:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }

    @Post('/attach')
    @ApiOperation({ summary: 'Attach a service to an exhibition for a contractor' })
    @ApiResponse({ status: 201, description: 'Service attached successfully.' })
    async attachService(
        @Body(new ValidationPipe()) createContractorServiceDto: CreateContractorServiceDto,
        @Res() res: Response
    ) {
        try {
            const service = await this.contractorServiceService.attachService(createContractorServiceDto);
            return res.status(HttpStatus.CREATED).json(this.successResponse(service, 'Service attached successfully.'));
        } catch (error) {
            logger.error('Error attaching service:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }

    @Post('/detach/:contractorId/:exhibitionId/:serviceId')
    @ApiOperation({ summary: 'Detach a service from an exhibition for a contractor' })
    @ApiResponse({ status: 200, description: 'Service detached successfully.' })
    async detachService(
        @Param('contractorId') contractorId: number,
        @Param('exhibitionId') exhibitionId: number,
        @Param('serviceId') serviceId: number,
        @Res() res: Response
    ) {
        try {
            await this.contractorServiceService.detachService(contractorId, exhibitionId, serviceId);
            return res.status(HttpStatus.OK).json(this.successResponse(null, 'Service detached successfully.'));
        } catch (error) {
            logger.error('Error detaching service:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }
}
