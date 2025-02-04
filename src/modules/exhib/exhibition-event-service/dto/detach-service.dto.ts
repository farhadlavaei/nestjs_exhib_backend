import {ApiProperty} from "@nestjs/swagger";
import {ArrayMinSize, IsArray, IsInt} from "class-validator";

export class DetachServicesDto {
    @ApiProperty({ example: [1, 2], description: 'Array of service IDs to detach' })
    @IsArray()
    @ArrayMinSize(1)
    @IsInt({ each: true })
    services: number[];
}
