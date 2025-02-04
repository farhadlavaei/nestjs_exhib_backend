import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateExpertDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    exhibition_id: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    user_id: number;
}
