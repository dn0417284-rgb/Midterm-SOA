import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('detai')
export class Detai {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tenDetai: string;

  @Column({ type: 'text' })
  moTa: string;
  // 0 = Chưa đăng ký
  // 1 = Đã đăng ký
  @Column({ type: 'tinyint', default: 0 })
  trangThai: number;
}
