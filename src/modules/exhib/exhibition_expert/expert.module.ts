import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpertController } from './expert.controller';
import { ExpertService } from './expert.service';
import { Expert } from './entities/expert.entity';
import { ExpertRepository } from './expert.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Expert])],
    controllers: [ExpertController],
    providers: [ExpertService, ExpertRepository],
    exports: [ExpertService, ExpertRepository],
})
export class ExpertModule {}
