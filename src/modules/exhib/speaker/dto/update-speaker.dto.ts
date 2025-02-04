import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateSpeakerDto {
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    event_id?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    user_id?: number;
}
