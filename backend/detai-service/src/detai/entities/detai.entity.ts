import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('detai')
export class Detai {
  @PrimaryGeneratedColumn()
  MDT: number;

  @Column()
  tenDetai: string;

  @Column({ name: 'giangVienHuongDan' })
  giangVienHuongDan: string;

  @Column({ type: 'text' })
  moTa: string;
  @Column({ type: 'tinyint', default: 0 })
  trangThai: number;
}
