import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    JoinColumn
} from 'typeorm';
import { ExhibitionEvent } from '../../exhibition-event/entities/exhibition-event.entity';
import { User } from '../../../user/entities/user.entity';

@Entity('speakers')
export class Speaker {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExhibitionEvent, (event) => event.speakers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'event_id' })
    event: ExhibitionEvent;

    @ManyToOne(() => User, (user) => user.speakingEvents, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at: Date;
}
