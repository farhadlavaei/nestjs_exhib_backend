import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    JoinColumn
} from 'typeorm';
import { ExhibitionEvent } from '../../exhibition-event/entities/exhibition-event.entity';

@Entity('sub_events')
export class SubEvent {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExhibitionEvent, (event) => event.parentSubEvents, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'parent_event_id' })
    parentEvent: ExhibitionEvent;

    @ManyToOne(() => ExhibitionEvent, (event) => event.childSubEvents, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sub_event_id' })
    childEvent: ExhibitionEvent;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at: Date;
}
