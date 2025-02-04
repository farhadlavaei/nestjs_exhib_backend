import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class UpdateContractorServiceDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    contractor_id?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    exhibition_id?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    service_id?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    price?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    active?: boolean;
}
