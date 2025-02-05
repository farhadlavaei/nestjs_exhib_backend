import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDiagramDto {
    @ApiProperty({ description: 'Name of the diagram' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'Diagram data' })
    @IsNotEmpty()
    @IsString()
    diagram: string;
}
