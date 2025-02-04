import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateSubEventDto {
    @ApiProperty({ description: 'Parent event ID', example: 1, required: false })
    @IsOptional()
    @IsNumber()
    parent_event_id?: number;

    @ApiProperty({ description: 'Sub event ID', example: 2, required: false })
    @IsOptional()
    @IsNumber()
    sub_event_id?: number;
}
