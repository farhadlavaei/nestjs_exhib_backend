import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateLocationDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    country?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    city?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    venue?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    hall?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    address?: string;
}
