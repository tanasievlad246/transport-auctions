import { Exclude } from 'class-transformer';
import { Auction } from 'src/auction/entities/auction.entity';
import { Bid } from 'src/auction/entities/bid.entity';
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';

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
  @Exclude({ toPlainOnly: true })
  password: string;
  @Column({
    nullable: false,
  })
  @Exclude({ toPlainOnly: true })
  salt: string;
  @Column({
    nullable: false,
    type: 'tinyint',
    default: 1,
  })
  @Exclude({ toPlainOnly: true })
  is_active: boolean;
  @Column({
    nullable: true,
    type: 'varchar',
  })
  @Exclude({ toPlainOnly: true })
  passwordResetToken: string;
  @Column({
    nullable: true,
    type: 'varchar',
  })
  @Exclude({ toPlainOnly: true })
  confirmationToken: string;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
  @OneToMany(() => Auction, (auction) => auction.user, { cascade: true })
  auctions: Auction[];
  @OneToMany(() => Bid, (bid) => bid.user, { cascade: true })
  bids: Bid[];
}
