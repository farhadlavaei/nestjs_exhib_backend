import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../../user/entities/user.entity';

@Entity('diagrams')
export class Diagram {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('longtext')
    diagram: string;

    @ManyToOne(() => User, user => user.diagrams, { onDelete: 'CASCADE' })
    user: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}
