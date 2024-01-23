import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ResetPassword } from '../mail/reset_password.entity';
import { Kategori } from '../kategori/kategori.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: false })
  nama: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({ nullable: true })
  role: string;

  @OneToMany(() => ResetPassword, (reset) => reset.user) // buat relasi one to many dengan tabel reset password
  reset_password: ResetPassword;

  @OneToMany(() => Kategori, (v) => v.created_by)
  kategori_created_by: Kategori[];

  @OneToMany(() => Kategori, (v) => v.updated_by)
  kategori_updated_by: Kategori[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
