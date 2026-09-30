import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('detai')
export class Detai {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tenDetai: string;

  @Column({ type: 'text' })
  moTa: string;

  @Column({ type: 'date' })
  ngayBatDau: Date;

  @Column({ type: 'date' })
  ngayKetThuc: Date;

  @Column()
  trangThai: string;
}
