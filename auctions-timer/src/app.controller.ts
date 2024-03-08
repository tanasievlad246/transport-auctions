import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, EventPattern, NatsContext, Payload } from '@nestjs/microservices';
import { Auction } from './auction.entity';
// import { Auction } from './auction.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('createAuction')
  async createAuction(@Payload() data: Auction, @Ctx() ctx: NatsContext) {
    try {
      console.log('Auction created', data);
      console.log('Subject', ctx.getSubject());
      await this.appService.createAuction(data as Auction);
      // console.log('Auction created', auction);
    } catch (error) {
      console.error(error);
    }
  }

  @EventPattern('schedule_job')
  testNats(@Payload() data: string, @Ctx() ctx: NatsContext): string {
    console.log('Subject', ctx.getSubject());
    console.log('Payload', data);
    return data;
  }
}
