import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    country: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    city: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    venue: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    hall?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    address?: string;
}
