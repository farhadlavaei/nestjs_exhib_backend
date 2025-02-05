import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsInt, IsString, IsEnum, IsNumber, Min, IsBoolean, IsJSON } from 'class-validator';

export class CreateExhibitionBoothDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    exhibition_event_id: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    exhibition_hall_id: number;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    company_id?: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    booth_number: string;

    @ApiProperty({ enum: ['standard', 'corner', 'island', 'ring'] })
    @IsNotEmpty()
    @IsEnum(['standard', 'corner', 'island', 'ring'])
    booth_type: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    @Min(0)
    price_irr?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    @Min(0)
    price_usd?: number;

    @ApiProperty()
    @IsOptional()
    @IsJSON()
    prices_other?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    @Min(6)
    width: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    @Min(6)
    height: number;

    @ApiProperty({ enum: ['low', 'medium', 'high'] })
    @IsNotEmpty()
    @IsEnum(['low', 'medium', 'high'])
    quality: string;

    @ApiProperty({ enum: ['ring', 'island', 'corner', 'wall', 'peninsula', 'high_traffic', 'end_cap', 'near_restrooms', 'near_entrance'] })
    @IsNotEmpty()
    @IsEnum(['ring', 'island', 'corner', 'wall', 'peninsula', 'high_traffic', 'end_cap', 'near_restrooms', 'near_entrance'])
    booth_layout: string;

    @ApiProperty()
    @IsOptional()
    @IsJSON()
    amenities?: string;

    @ApiProperty({ enum: ['pending', 'reserved', 'confirmed', 'paid', 'canceled'] })
    @IsNotEmpty()
    @IsEnum(['pending', 'reserved', 'confirmed', 'paid', 'canceled'])
    status: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    reservation_date_temp?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    reservation_date?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    is_temp_reservation: boolean;

    @ApiProperty()
    @IsOptional()
    @IsString()
    expiration_date?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    barcode: string;
}
