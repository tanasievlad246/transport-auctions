import { ParcelType } from 'src/types/enums';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Operation } from './operation.entity';

@Entity({
  name: 'parcels',
})
export class Parcel {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    nullable: false,
  })
  height: number;
  @Column({
    nullable: false,
  })
  width: number;
  @Column({
    nullable: false,
  })
  length: number;
  @Column({
    nullable: false,
  })
  weight: number;
  @Column({
    nullable: false,
  })
  qty: number;
  @Column({
    nullable: true,
    default: false,
  })
  fragile: boolean;
  @Column({
    nullable: true,
    default: false,
  })
  description: string;
  @Column({
    type: 'enum',
    enum: ParcelType,
    nullable: false,
  })
  type: ParcelType;
  @Column({
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
  @ManyToOne(() => Operation, (operation) => operation.parcels)
  operation: Operation;
}
