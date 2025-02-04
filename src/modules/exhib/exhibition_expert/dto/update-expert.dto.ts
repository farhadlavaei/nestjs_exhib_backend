import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateExpertDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    exhibition_id?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    user_id?: number;
}
