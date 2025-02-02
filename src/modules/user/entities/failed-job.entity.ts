import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('failed_jobs')
export class FailedJob {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 255 }) // Example for job name
    job: string;

    @Column('json') // Change to 'json' if your MySQL version supports it
    payload: any; // Use 'any' or define a more specific interface if needed

    @Column('json') // Change to 'json' to store the exception details
    exception: any; // Adjust type as necessary

    @Column('datetime') // For timestamps
    created_at: Date;

    @Column('datetime')
    failed_at: Date;
}
