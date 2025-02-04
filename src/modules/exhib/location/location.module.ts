import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { Location } from './entities/location.entity';
import { LocationRepository } from './location.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Location, LocationRepository])],
    controllers: [LocationController],
    providers: [LocationService, LocationRepository],
    exports: [LocationService, LocationRepository],
})
export class LocationModule {}
