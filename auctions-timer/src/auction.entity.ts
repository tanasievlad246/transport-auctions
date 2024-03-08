import { User } from './user';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuctionDocument = HydratedDocument<Auction>;

@Schema()
export class Auction {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  startTimestamp: Date;
  @Prop({ required: true })
  endTimestamp: Date;
  @Prop({ required: true })
  createdAt: Date;
  @Prop({ required: true })
  active: boolean;
  @Prop({ required: true })
  user: User;
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);
