
import {
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('DANGKY')
export class DangKy {
  @PrimaryColumn({
    name: 'MSV',
    type: 'varchar',
    length: 20,
  })
  MSV: string;

  @PrimaryColumn({
    name: 'DETAI_ID',
    type: 'int',
  })
  DETAI_ID: number;

  @Column({
    name: 'NGAY_DANG_KY',
    type: 'datetime',
  })
  NGAY_DANG_KY: Date;
}
