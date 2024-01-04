import { Bid } from 'src/bid/entities/bid.entity';
import { Operation } from 'src/operation/entities/operation.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Auction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    type: 'varchar',
  })
  name: string;

  @Column({
    nullable: false,
  })
  @Generated('increment')
  numberCount: number;
  @Column({
    nullable: false,
    type: 'timestamp',
  })
  startTimestamp: Date;
  @Column({
    nullable: false,
    type: 'timestamp',
  })
  endTimestamp: Date;
  @Column({
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  creationDate: Date;
  @Column({
    nullable: false,
    type: 'decimal',
  })
  km: number;
  @Column({
    default: false,
  })
  finished: boolean;
  @Column({
    default: false,
  })
  active: boolean;
  @Column({
    nullable: false,
  })
  images: string[];
  @OneToOne(() => User)
  winner: User;
  @OneToMany(() => Bid, (bid) => bid.auction)
  bids: Bid[];
  @OneToMany(() => Operation, (operation) => operation.loadingFor)
  loadings: Operation[];
  @OneToMany(() => Operation, (operation) => operation.unloadingFor)
  unloadings: Operation[];
  @ManyToOne(() => User, (user) => user.auctions)
  user: User;
}
