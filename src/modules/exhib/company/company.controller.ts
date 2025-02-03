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
    Req,
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
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import {JwtPayload} from "../../auth/jwt.payload";
import logger from "../../../logger";


@ApiTags('Company')
@Controller('company')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

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
    @ApiOperation({ summary: 'Get list of companies' })
    @ApiResponse({ status: 200, description: 'Companies retrieved successfully.' })
    async index(@Req() req: any, @Query('per_page') perPage: number, @Res() res: Response) {
        try {
            const user = req.user as JwtPayload;
            const companies = await this.companyService.getCompanies(user.id, perPage);
            return res.status(HttpStatus.OK).json(this.successResponse(companies));
        } catch (error) {
            logger.error('Error fetching companies:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }

    @Post()
    @ApiOperation({ summary: 'Create a new company' })
    @ApiResponse({ status: 201, description: 'Company created successfully.' })
    @ApiBody({ type: CreateCompanyDto })
    async store(@Body(new ValidationPipe()) createCompanyDto: CreateCompanyDto, @Req() req: any, @Res() res: Response) {
        try {
            const user = req.user as JwtPayload;
            const company = await this.companyService.createCompany(user.id, createCompanyDto);
            return res.status(HttpStatus.CREATED).json(this.successResponse(company, 'Company created successfully.'));
        } catch (error) {
            logger.error('Error creating company:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific company' })
    @ApiResponse({ status: 200, description: 'Company retrieved successfully.' })
    async show(@Param('id') id: number, @Req() req: any, @Res() res: Response) {
        try {
            const user = req.user as JwtPayload;
            const company = await this.companyService.getCompanyById(id, user.id);
            return res.status(HttpStatus.OK).json(this.successResponse(company));
        } catch (error) {
            logger.error('Error fetching company:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a company' })
    @ApiResponse({ status: 200, description: 'Company updated successfully.' })
    @ApiBody({ type: UpdateCompanyDto })
    async update(@Param('id') id: number, @Body() updateCompanyDto: UpdateCompanyDto, @Req() req: any, @Res() res: Response) {
        try {
            const user = req.user as JwtPayload;
            const updatedCompany = await this.companyService.updateCompany(id, user.id, updateCompanyDto);
            return res.status(HttpStatus.OK).json(this.successResponse(updatedCompany, 'Company updated successfully.'));
        } catch (error) {
            logger.error('Error updating company:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a company' })
    @ApiResponse({ status: 204, description: 'Company deleted successfully.' })
    async destroy(@Param('id') id: number, @Req() req: any, @Res() res: Response) {
        try {
            const user = req.user as JwtPayload;
            await this.companyService.deleteCompany(id, user.id);
            return res.status(HttpStatus.NO_CONTENT).send();
        } catch (error) {
            logger.error('Error deleting company:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.failResponse(error.message));
        }
    }
}
