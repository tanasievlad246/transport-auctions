import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Parcel } from './parcel.entity';
import { OperationStatus } from 'src/types/enums';
import { Auction } from 'src/auction/entities/auction.entity';

@Entity({
  name: 'operations',
})
export class Operation {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    nullable: false,
    type: 'varchar',
  })
  street: string;
  @Column({
    nullable: false,
    type: 'varchar',
  })
  number: string;
  @Column({
    nullable: false,
    type: 'varchar',
  })
  city: string;
  @Column({
    nullable: false,
    type: 'varchar',
  })
  country: string;
  @Column({
    nullable: false,
    type: 'varchar',
  })
  dock: string;
  @Column({
    nullable: false,
    type: 'varchar',
  })
  coordinates: string;
  @OneToMany(() => Parcel, (parcel) => parcel.operation)
  parcels: Parcel[];
  @Column({
    nullable: false,
    type: 'varchar',
  })
  description: string;
  @Column({
    nullable: false,
    type: 'timestamp',
  })
  executionDate: Date;
  @Column({
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
  @Column({
    enum: OperationStatus,
    type: 'enum',
    default: OperationStatus.PENDING,
  })
  status: OperationStatus;
  @ManyToOne(() => Auction, (auction) => auction.loadings)
  loadingFor: Auction;
  @ManyToOne(() => Auction, (auction) => auction.unloadings)
  unloadingFor: Auction;
}
