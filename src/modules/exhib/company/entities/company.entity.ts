import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn, JoinColumn, OneToMany,
} from 'typeorm';
import {User} from "../../../user/entities/user.entity";
import {ExhibitionEvent} from "../../exhibition-event/entities/exhibition-event.entity";

@Entity('companies')
export class Company {
    @PrimaryGeneratedColumn()
    id: number;



    @Column()
    company_name: string;

    @Column()
    company_name_en: string;

    @Column({ nullable: true })
    brand_names: string;

    @Column({ nullable: true })
    brand_names_en: string;

    @Column()
    economic_code: string;

    @Column()
    registration_number: string;

    @Column({ nullable: true })
    national_id: string;

    @Column({ nullable: true })
    registration_place: string;

    @Column({ nullable: true })
    company_nationality: string;

    @Column({ nullable: true })
    registration_date: string;

    @Column({ nullable: true })
    previous_name: string;

    @Column({ nullable: true })
    status: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    province: string;

    @Column({ nullable: true })
    province_activity: string;

    @Column({ nullable: true })
    city: string;

    @Column()
    address: string;

    @Column()
    address_en: string;

    @Column({ nullable: true })
    phone_code: string;

    @Column()
    landline_phones: string;

    @Column({ nullable: true })
    mobile_phone: string;

    @Column({ nullable: true })
    fax: string;

    @Column({ nullable: true, type: 'text' })
    phone_fax_description: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    website: string;

    @Column({ nullable: true })
    board_member_name: string;

    @Column({ nullable: true })
    representative_name: string;

    @Column({ nullable: true })
    education_level: string;

    @Column({ nullable: true })
    position: string;

    @Column({ nullable: true })
    is_employee: boolean;

    @Column()
    ceo_gender: string;

    @Column()
    ceo_first_name: string;

    @Column()
    ceo_last_name: string;

    @Column()
    ceo_first_name_en: string;

    @Column()
    ceo_last_name_en: string;

    @Column()
    ceo_mobile: string;

    @Column()
    ceo_email: string;

    @Column({ nullable: true })
    legal_representative_gender: string;

    @Column({ nullable: true })
    legal_representative_last_name: string;

    @Column({ nullable: true })
    legal_representative_first_name: string;

    @Column({ nullable: true, type: 'date' })
    date_of_birth: Date;

    @Column({ nullable: true })
    id_number: string;

    @Column({ nullable: true })
    place_of_birth: string;

    @Column({ nullable: true })
    national_code: string;

    @Column({ nullable: true })
    education_level_legal_representative: string;

    @Column({ nullable: true })
    position_legal_representative: string;

    @Column({ nullable: true })
    position_legal_representative_date: string;

    @Column({ nullable: true })
    position_day: string;

    @Column({ nullable: true })
    position_month: string;

    @Column({ nullable: true })
    position_year: string;

    @Column({ nullable: true })
    legal_representative_mobile: string;

    @Column({ nullable: true })
    legal_representative_position: string;

    @Column({ nullable: true })
    full_address_residence: string;

    @Column({ nullable: true })
    ownership_type: string;

    @Column({ nullable: true })
    landline_phone_residence: string;

    @Column({ nullable: true })
    mobile_phone_residence: string;

    @Column({ nullable: true })
    fax_residence: string;

    @Column({ nullable: true })
    email_residence: string;

    @Column()
    activity_type: string;

    @Column({ type: 'text' })
    activity_description: string;

    @Column({ type: 'text' })
    activity_description_en: string;

    @OneToMany(() => ExhibitionEvent, (event) => event.company, { cascade: true })
    events: ExhibitionEvent[];

    @OneToMany(() => ExhibitionEvent, (event) => event.organizer)
    organizedEvents: ExhibitionEvent[];

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at: Date;

    @ManyToOne(() => User, (user) => user.companies, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

}
