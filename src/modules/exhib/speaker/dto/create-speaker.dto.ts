import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSpeakerDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    event_id: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    user_id: number;
}
