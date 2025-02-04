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
import {Company} from "../../company/entities/company.entity";

@Entity('exhibition_contractor')
export class ExhibitionContractor {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExhibitionEvent, (event) => event.contractors, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'exhibition_id' })
    event: ExhibitionEvent;

    @ManyToOne(() => Company, (company) => company.exhibitionContracts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
