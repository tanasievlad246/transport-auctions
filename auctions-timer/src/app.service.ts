import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auction } from './auction.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async createAuction(auction: Auction): Promise<Auction> {
    const createdAuction = await this.auctionModel.create(auction);
    this.scheduleAuctionClose(createdAuction.id, createdAuction.endTimestamp);
    return createdAuction;
  }

  private scheduleAuctionClose(auctionId: string, endTime: Date) {
    const timeout = endTime.getTime() - Date.now();
    this.schedulerRegistry.addTimeout(
      auctionId,
      setTimeout(async () => {
        await this.closeAuction(auctionId);
      }, timeout),
    );
  }

  async findOne(id: string): Promise<Auction> {
    return this.auctionModel
      .findOne({
        id,
      })
      .exec();
  }

  async closeAuction(auctionId: string): Promise<Auction> {
    return this.auctionModel
      .findOneAndUpdate({ id: auctionId }, { active: false }, { new: true })
      .exec();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
