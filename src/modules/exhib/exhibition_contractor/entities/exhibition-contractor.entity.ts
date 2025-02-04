import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    JoinColumn, OneToMany
} from 'typeorm';
import { ExhibitionEvent } from '../../exhibition-event/entities/exhibition-event.entity';
import {Company} from "../../company/entities/company.entity";
import {ContractorService} from "../../contractor-service/entities/contractor-service.entity";

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

    @OneToMany(() => ContractorService, (contractorService) => contractorService.contractor, { cascade: true })
    contractorServices: ContractorService[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
