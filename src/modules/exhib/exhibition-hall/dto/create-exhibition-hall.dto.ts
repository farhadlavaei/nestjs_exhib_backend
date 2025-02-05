import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsEnum, IsString } from 'class-validator';

export class CreateExhibitionHallDto {
    @ApiProperty({ example: 'Main Hall', description: 'The name of the exhibition hall' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 50.5, description: 'The length of the hall in meters' })
    @IsNotEmpty()
    @IsNumber()
    length: number;

    @ApiProperty({ example: 30.2, description: 'The width of the hall in meters' })
    @IsNotEmpty()
    @IsNumber()
    width: number;

    @ApiProperty({ example: 10.0, description: 'The height of the hall in meters' })
    @IsNotEmpty()
    @IsNumber()
    height: number;

    @ApiProperty({ example: 500, description: 'Capacity of the hall (number of people)' })
    @IsNotEmpty()
    @IsNumber()
    capacity: number;

    @ApiProperty({ example: 'tile', enum: ['carpet', 'tile', 'wood', 'other'], description: 'Type of flooring in the hall' })
    @IsNotEmpty()
    @IsEnum(['carpet', 'tile', 'wood', 'other'])
    floor_type: string;

    @ApiProperty({ example: 2000, description: 'Load capacity in kilograms' })
    @IsNotEmpty()
    @IsNumber()
    load_capacity: number;

    @ApiProperty({ example: true, description: 'Whether the hall has air conditioning' })
    @IsOptional()
    @IsBoolean()
    has_air_conditioning: boolean;

    @ApiProperty({ example: false, description: 'Whether the hall has heating system' })
    @IsOptional()
    @IsBoolean()
    has_heating: boolean;

    @ApiProperty({ example: true, description: 'Whether the hall has water supply' })
    @IsOptional()
    @IsBoolean()
    has_water_supply: boolean;

    @ApiProperty({ example: true, description: 'Whether the hall has electricity' })
    @IsOptional()
    @IsBoolean()
    has_electricity: boolean;

    @ApiProperty({ example: true, description: 'Whether the hall has internet connection' })
    @IsOptional()
    @IsBoolean()
    has_internet: boolean;

    @ApiProperty({ example: false, description: 'Whether the hall has security system' })
    @IsOptional()
    @IsBoolean()
    has_security_system: boolean;

    @ApiProperty({ example: true, description: 'Whether the hall has an audio-visual system' })
    @IsOptional()
    @IsBoolean()
    has_audio_visual_system: boolean;

    @ApiProperty({ example: true, description: 'Whether the hall has storage space' })
    @IsOptional()
    @IsBoolean()
    has_storage_space: boolean;

    @ApiProperty({ example: true, description: 'Whether the hall has parking' })
    @IsOptional()
    @IsBoolean()
    has_parking: boolean;

    @ApiProperty({ example: 100, description: 'The capacity of parking if available' })
    @IsOptional()
    @IsNumber()
    parking_capacity: number;
}
