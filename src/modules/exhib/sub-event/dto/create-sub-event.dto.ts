import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSubEventDto {
    @ApiProperty({ description: 'Parent event ID', example: 1 })
    @IsNotEmpty()
    @IsNumber()
    parent_event_id: number;

    @ApiProperty({ description: 'Sub event ID', example: 2 })
    @IsNotEmpty()
    @IsNumber()
    sub_event_id: number;
}
