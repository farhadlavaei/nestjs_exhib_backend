import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { ExhibitionEvent } from '../../exhibition-event/entities/exhibition-event.entity';
import { User } from '../../../user/entities/user.entity';

@Entity('exhibition_expert')
export class Expert {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExhibitionEvent, (event) => event.experts, { onDelete: 'CASCADE' })
    event: ExhibitionEvent;

    @ManyToOne(() => User, (user) => user.expertEvents, { onDelete: 'CASCADE' })
    user: User;

    @CreateDateColumn()
    created_at: Date;

}
