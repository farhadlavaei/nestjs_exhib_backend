import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';

export class CreateCompanyDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    company_name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    company_name_en: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    brand_names: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    brand_names_en: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    economic_code: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    registration_number: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    national_id: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    address: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    address_en: string;

    @ApiProperty()
    @IsOptional()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    website: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    activity_type: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    activity_description: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    activity_description_en: string;
}
