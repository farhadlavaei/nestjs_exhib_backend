import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateContractorServiceDto {
    @ApiProperty()
    @IsNumber()
    contractor_id: number;

    @ApiProperty()
    @IsNumber()
    exhibition_id: number;

    @ApiProperty()
    @IsNumber()
    service_id: number;

    @ApiProperty()
    @IsNumber()
    price: number;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    active?: boolean;
}
