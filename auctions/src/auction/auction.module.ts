import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { BidService } from './bid/bid.service';
import { OperationService } from './operation/operation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from './entities/auction.entity';
import { Bid } from './entities/bid.entity';
import { Operation } from './entities/operation.entity';
import { Parcel } from './entities/parcel.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { TimerService } from './timer/timer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Auction, Bid, Operation, Parcel, User])],
  controllers: [AuctionController],
  providers: [AuctionService, BidService, OperationService, UserService, TimerService],
})
export class AuctionModule {}
