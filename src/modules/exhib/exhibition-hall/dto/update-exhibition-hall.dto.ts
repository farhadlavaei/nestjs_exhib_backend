import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsBoolean, IsEnum, IsString } from 'class-validator';

export class UpdateExhibitionHallDto {
    @ApiProperty({ example: 'Main Hall', description: 'The name of the exhibition hall', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ example: 50.5, description: 'The length of the hall in meters', required: false })
    @IsOptional()
    @IsNumber()
    length?: number;

    @ApiProperty({ example: 30.2, description: 'The width of the hall in meters', required: false })
    @IsOptional()
    @IsNumber()
    width?: number;

    @ApiProperty({ example: 10.0, description: 'The height of the hall in meters', required: false })
    @IsOptional()
    @IsNumber()
    height?: number;

    @ApiProperty({ example: 500, description: 'Capacity of the hall (number of people)', required: false })
    @IsOptional()
    @IsNumber()
    capacity?: number;

    @ApiProperty({ example: 'tile', enum: ['carpet', 'tile', 'wood', 'other'], description: 'Type of flooring in the hall', required: false })
    @IsOptional()
    @IsEnum(['carpet', 'tile', 'wood', 'other'])
    floor_type?: string;

    @ApiProperty({ example: 2000, description: 'Load capacity in kilograms', required: false })
    @IsOptional()
    @IsNumber()
    load_capacity?: number;

    @ApiProperty({ example: true, description: 'Whether the hall has air conditioning', required: false })
    @IsOptional()
    @IsBoolean()
    has_air_conditioning?: boolean;

    @ApiProperty({ example: false, description: 'Whether the hall has heating system', required: false })
    @IsOptional()
    @IsBoolean()
    has_heating?: boolean;

    @ApiProperty({ example: true, description: 'Whether the hall has water supply', required: false })
    @IsOptional()
    @IsBoolean()
    has_water_supply?: boolean;

    @ApiProperty({ example: true, description: 'Whether the hall has electricity', required: false })
    @IsOptional()
    @IsBoolean()
    has_electricity?: boolean;

    @ApiProperty({ example: true, description: 'Whether the hall has internet connection', required: false })
    @IsOptional()
    @IsBoolean()
    has_internet?: boolean;

    @ApiProperty({ example: false, description: 'Whether the hall has security system', required: false })
    @IsOptional()
    @IsBoolean()
    has_security_system?: boolean;

    @ApiProperty({ example: true, description: 'Whether the hall has an audio-visual system', required: false })
    @IsOptional()
    @IsBoolean()
    has_audio_visual_system?: boolean;

    @ApiProperty({ example: true, description: 'Whether the hall has storage space', required: false })
    @IsOptional()
    @IsBoolean()
    has_storage_space?: boolean;

    @ApiProperty({ example: true, description: 'Whether the hall has parking', required: false })
    @IsOptional()
    @IsBoolean()
    has_parking?: boolean;

    @ApiProperty({ example: 100, description: 'The capacity of parking if available', required: false })
    @IsOptional()
    @IsNumber()
    parking_capacity?: number;
}
