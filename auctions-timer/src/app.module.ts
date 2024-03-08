import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Auction, AuctionSchema } from './auction.entity';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb-service/nest'),
    MongooseModule.forFeature([{ name: Auction.name, schema: AuctionSchema }]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
