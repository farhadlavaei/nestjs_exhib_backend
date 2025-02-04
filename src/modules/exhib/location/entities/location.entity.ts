import { Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { ExhibitionEvent } from '../../exhibition-event/entities/exhibition-event.entity';

@Entity('locations')
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    country: string;

    @Column()
    city: string;

    @Column()
    venue: string;

    @Column({ nullable: true })
    hall: string;

    @Column({ nullable: true })
    address: string;

    @OneToMany(() => ExhibitionEvent, (event) => event.location)
    events: ExhibitionEvent[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at: Date;

}
