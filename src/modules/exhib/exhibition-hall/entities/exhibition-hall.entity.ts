import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToMany, OneToMany,
} from 'typeorm';
import { ExhibitionEvent } from '../../exhibition-event/entities/exhibition-event.entity';
import {ExhibitionBooth} from "../../exhibition-booth/entities/exhibition-booth.entity";

@Entity('exhibition_halls')
export class ExhibitionHall {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    length: number;

    @Column('decimal', { precision: 10, scale: 2 })
    width: number;

    @Column('decimal', { precision: 10, scale: 2 })
    height: number;

    @Column('int')
    capacity: number;

    @Column({ type: 'enum', enum: ['carpet', 'tile', 'wood', 'other'] })
    floor_type: string;

    @Column('int')
    load_capacity: number;

    @Column({ default: false })
    has_air_conditioning: boolean;

    @Column({ default: false })
    has_heating: boolean;

    @Column({ default: false })
    has_water_supply: boolean;

    @Column({ default: false })
    has_electricity: boolean;

    @Column({ default: false })
    has_internet: boolean;

    @Column({ default: false })
    has_security_system: boolean;

    @Column({ default: false })
    has_audio_visual_system: boolean;

    @Column({ default: false })
    has_storage_space: boolean;

    @Column({ default: false })
    has_parking: boolean;

    @Column({ type: 'int', nullable: true })
    parking_capacity: number;

    @ManyToMany(() => ExhibitionEvent, (event) => event.halls)
    events: ExhibitionEvent[];

    @OneToMany(() => ExhibitionBooth, booth => booth.exhibition_hall)
    booths: ExhibitionBooth[];


    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
