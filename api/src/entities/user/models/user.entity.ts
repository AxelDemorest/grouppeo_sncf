import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserType {
    ADMIN = 'Administrateur',
    UOSERV = 'UO service',
    AGENT = 'Agent',
    USER = 'Utilisateur'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    user_cp: string;

    @Column()
    user_mail: string;

    @Column()
    user_first_name: string;

    @Column()
    user_last_name: string;

    @Column()
    user_password: string;

    @Column({ type: 'enum', enum: UserType, default: UserType.USER })
    user_type: UserType;
}