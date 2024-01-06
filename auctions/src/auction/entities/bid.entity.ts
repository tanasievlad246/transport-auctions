import { Auction } from 'src/auction/entities/auction.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'bids',
})
export class Bid {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    nullable: false,
    type: 'decimal',
  })
  bidAmount: number;
  @Column({
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
  @Column({
    nullable: false,
    type: 'timestamp',
  })
  startDate: Date;
  @Column({
    nullable: false,
    type: 'timestamp',
  })
  endDate: Date;
  @ManyToOne(() => Auction, (auction) => auction.bids)
  auction: Auction;
  @ManyToOne(() => User, (user) => user.bids)
  user: User;
}
