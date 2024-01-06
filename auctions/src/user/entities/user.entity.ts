import { Auction } from 'src/auction/entities/auction.entity';
import { Bid } from 'src/auction/entities/bid.entity';
import { Entity, Column, PrimaryColumn, Generated, OneToMany } from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryColumn({
    type: 'varchar',
    unique: true,
  })
  email: string;
  @Column({
    nullable: false,
    type: 'varchar',
  })
  firstName: string;
  @Column({
    nullable: false,
    type: 'varchar',
  })
  lastName: string;
  @Column({
    nullable: false,
  })
  password: string;
  @Column({
    nullable: false,
  })
  salt: string;
  @Column({
    nullable: false,
    type: 'tinyint',
    default: 1,
  })
  is_active: boolean;
  @Column({
    nullable: true,
    type: 'varchar',
  })
  @Generated('uuid')
  passwordResetToken: string;
  @Column({
    nullable: true,
    type: 'varchar',
  })
  @Generated('uuid')
  confirmationToken: string;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
  @OneToMany(() => Auction, (auction) => auction.user)
  auctions: Auction[];
  @OneToMany(() => Bid, (bid) => bid.user)
  bids: Bid[];
}
