import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UsageType {
  DOMESTICO = 'domestico',
  INDUSTRIALE = 'industriale',
  COMMERCIALE = 'commerciale',
  AGRICOLO = 'agricolo',
  ALTRO = 'altro',
}

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matricola: string;

  @Column()
  nome: string;

  @Column()
  cognome: string;

  @Column()
  indirizzo: string; // Via e Civico

  @Column({
    type: 'enum',
    enum: UsageType,
    default: UsageType.DOMESTICO,
  })
  uso: UsageType;

  @Column({ type: 'date' })
  data_lettura: string;

  @Column({ type: 'int' })
  lettura_annuale: number;

  @Column({ type: 'int', nullable: true })
  lettura_precedente: number;

  @Column()
  codice_fiscale: string;

  @Column({ length: 20 })
  telefono: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  foto_url: string;

  @Column({ nullable: true })
  ip_hash: string;

  @Column({ nullable: true })
  user_agent_hash: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
