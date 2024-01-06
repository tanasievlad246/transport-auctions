import { Bid } from './bid.entity';
import { Operation } from './operation.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'auctions',
})
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
    type: 'timestamp',
  })
  startTimestamp: Date;
  @Column({
    nullable: false,
    type: 'timestamp',
  })
  endTimestamp: Date;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
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
    default: true,
  })
  active: boolean;
  @OneToOne(() => User)
  winner: User;
  @OneToMany(() => Bid, (bid) => bid.auction, { cascade: true })
  bids: Bid[];
  @OneToMany(() => Operation, (operation) => operation.loadingFor, {
    cascade: true,
  })
  loadings: Operation[];
  @OneToMany(() => Operation, (operation) => operation.unloadingFor, {
    cascade: true,
  })
  unloadings: Operation[];
  @ManyToOne(() => User, (user) => user.auctions)
  user: User;
}
