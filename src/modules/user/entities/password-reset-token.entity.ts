import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PasswordResetToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    token: string;

    @Column({ type: 'timestamp', nullable: true })
    created_at: Date | null;
}
