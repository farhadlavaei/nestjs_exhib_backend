import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, Min, ArrayMinSize } from 'class-validator';

export class AssociateServicesDto {
    @ApiProperty({ example: [1, 2, 3], description: 'Array of service IDs' })
    @IsArray()
    @ArrayMinSize(1)
    @IsInt({ each: true })
    services: number[];
}


