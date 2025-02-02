import { IsArray, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import {ApiProperty} from "@nestjs/swagger";

export class TrainDocumentsDto {
    @ApiProperty({
        description: 'Array of documents to be trained',
        type: [String],
        example: [
            "این یک داکیومنت تست شماره 1 است که شامل اطلاعات اولیه درباره محصول می‌باشد.",
            "این یک داکیومنت تست شماره 2 است که به بررسی ویژگی‌های کلیدی محصول می‌پردازد."
        ],
    })
    @IsArray()
    @IsString({ each: true })
    @Type(() => String)
    documents: string[];
}
