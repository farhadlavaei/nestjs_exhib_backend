import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    HttpStatus,
    Res
} from '@nestjs/common';
import { ExhibitionContractorService } from './exhibition-contractor.service';
import { AttachContractorDto } from './dto/attach-contractor.dto';
import { DetachContractorDto } from './dto/detach-contractor.dto';
import { Response } from 'express';

@Controller('exhibition_contractor')
export class ExhibitionContractorController {
    constructor(private readonly contractorService: ExhibitionContractorService) {}

    @Post('/attach')
    async attachToEvent(@Body() attachDto: AttachContractorDto, @Res() res: Response) {
        try {
            const contractors = await this.contractorService.attachToEvent(attachDto);
            return res.status(HttpStatus.CREATED).json({ status: 'success', data: contractors });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: 'fail', message: error.message });
        }
    }

    @Post('/detach')
    async detachFromEvent(@Body() detachDto: DetachContractorDto, @Res() res: Response) {
        try {
            const contractors = await this.contractorService.detachFromEvent(detachDto);
            return res.status(HttpStatus.OK).json({ status: 'success', data: contractors });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: 'fail', message: error.message });
        }
    }

    @Get('/list/:eventId')
    async listContractors(@Param('eventId') eventId: number, @Res() res: Response) {
        try {
            const contractors = await this.contractorService.listContractors(eventId);
            return res.status(HttpStatus.OK).json({ status: 'success', data: contractors });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: 'fail', message: error.message });
        }
    }
}
