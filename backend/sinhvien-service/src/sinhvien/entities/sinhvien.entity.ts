import {
  Entity,
  Column,
  PrimaryColumn,
} from 'typeorm';

@Entity('SINHVIEN')
export class SinhVien {
  @PrimaryColumn({
    name: 'MSV',
    type: 'varchar',
    length: 20,
  })
  MSV: string;

  @Column({
    name: 'TENSV',
    type: 'varchar',
    length: 100,
  })
  TENSV: string;

  @Column({
    name: 'KHOA',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  KHOA: string | null;

  @Column({
    name: 'DIEMTB',
    type: 'decimal',
    precision: 3,
    scale: 2,
    nullable: true,
  })
  DIEMTB: number | null;

  @Column({
    name: 'LOP',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  LOP: string | null;

  @Column({
    name: 'EMAIL',
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: true,
  })
  EMAIL: string | null;

  @Column({
    name: 'MATKHAU',
    type: 'varchar',
    length: 255,
    nullable: true,
    select: false,
  })
  MATKHAU: string | null;

  @Column({
    name: 'VAITRO',
    type: 'varchar',
    length: 20,
    default: 'SINHVIEN',
  })
  VAITRO: string;
}