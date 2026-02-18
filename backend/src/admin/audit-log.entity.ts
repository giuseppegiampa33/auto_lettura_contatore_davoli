import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    action: string; // e.g. 'LOGIN', 'VIEW_SUBMISSIONS', 'EXPORT_CSV'

    @Column({ nullable: true })
    admin_user_id: string;

    @Column({ nullable: true })
    ip_hash: string;

    @Column({ type: 'text', nullable: true })
    details: string;

    @CreateDateColumn()
    created_at: Date;
}
