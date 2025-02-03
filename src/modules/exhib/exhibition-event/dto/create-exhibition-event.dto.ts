import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsOptional, IsString, IsBoolean, IsDateString, IsEmail, IsNumber} from 'class-validator';

export class CreateExhibitionEventDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    event_name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    event_name_en: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    event_type: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    start_date: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    start_time: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    end_date: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    end_time: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    registration_start_date: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    registration_end_date: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description_en: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    is_recurring: boolean;

    @ApiProperty()
    @IsOptional()
    @IsString()
    recurrence_rule?: string;

    @ApiProperty()
    @IsOptional()
    @IsEmail()
    contact_email?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    contact_phone?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    website?: string;

    @ApiProperty({ example: 1, description: 'Company ID that organizes the event' })
    @IsNotEmpty()
    @IsNumber()
    company_id: number;
}
