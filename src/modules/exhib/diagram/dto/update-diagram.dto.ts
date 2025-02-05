import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateDiagramDto {
    @ApiProperty({ description: 'Name of the diagram' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ description: 'Diagram data' })
    @IsOptional()
    @IsString()
    diagram?: string;
}
