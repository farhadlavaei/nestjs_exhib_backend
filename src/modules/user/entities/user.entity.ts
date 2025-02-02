// src/users/entities/user.entity.ts
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    instagram_id: string;

    @Column({ nullable: true })
    first_name: string;

    @Column({ nullable: true })
    last_name: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({ unique: true })
    username: string;

    @Column({ nullable: true })
    full_name: string;

    @Column({ nullable: true })
    profile_pic_url: string;

    @Column({ default: false })
    is_verified: boolean;

    @Column({ default: false })
    is_private: boolean;

    @Column({ nullable: true })
    token_expires_at: Date;

    @Column({ default: false })
    is_showed_tour: boolean;

    @Column({ nullable: true })
    mobile: string;

    @Column({ nullable: true })
    otp_code: string;

    @Column({ nullable: true })
    otp_expires_at: Date;

    @Column({ nullable: true })
    email_verified_at: Date;

    @Column()
    remember_token: string;

}
