import { IsNotEmpty, IsNumber } from 'class-validator';

export class DetachContractorDto {
    @IsNotEmpty()
    @IsNumber()
    exhibition_id: number;

    @IsNotEmpty()
    @IsNumber()
    company_id: number;
}
