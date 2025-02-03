import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsDateString, IsEmail } from 'class-validator';

export class UpdateExhibitionEventDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    event_name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    event_name_en?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    event_type?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    start_date?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    start_time?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    end_date?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    end_time?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    registration_start_date?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    registration_end_date?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description_en?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    is_recurring?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    recurrence_rule?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEmail()
    contact_email?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    contact_phone?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    website?: string;
}
