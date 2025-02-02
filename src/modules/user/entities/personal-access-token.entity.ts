import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class PersonalAccessToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tokenable_type: string;

    @Column()
    tokenable_id: number;

    @Column()
    name: string;

    @Column()
    token: string;

    //  Define the 'abilities' column as type 'text' to avoid inferring an Object type.
    @Column({type: 'text', nullable: true})
    abilities: string | null;

    //  Define the 'last_used_at' column with explicit type 'timestamp' for MySQL compatibility.
    @Column({type: 'timestamp', nullable: true})
    last_used_at: Date | null;

    //  Define the 'expires_at' column with explicit type 'timestamp' to ensure MySQL supports it.
    @Column({type: 'timestamp', nullable: true})
    expires_at: Date | null;

    //  Use CURRENT_TIMESTAMP as the default value for created_at.
    @Column({default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;

    //  Use CURRENT_TIMESTAMP as the default value for updated_at.
    @Column({default: () => 'CURRENT_TIMESTAMP'})
    updated_at: Date;
}
