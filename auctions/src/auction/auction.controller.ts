import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/user/auth/auth.guard';
import { CreateBidDto } from './dto/create-bid.dto';
import { Request } from 'express';

@ApiTags('auctions')
@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createAuctionDto: CreateAuctionDto,
    @Req() req: Request,
  ) {
    const auction = await this.auctionService.create(
      createAuctionDto,
      req.user.email,
    );
    return auction;
  }

  @Get()
  findAll() {
    return this.auctionService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auctionService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuctionDto: UpdateAuctionDto) {
    return this.auctionService.update(id, updateAuctionDto);
  }
  5;
  @UseGuards(AuthGuard)
  @Post(':id/bid')
  addBid(
    @Param('id') id: string,
    @Body() createBidDto: CreateBidDto,
    @Req() req: Request,
  ) {
    this.auctionService.addBid(id, createBidDto, req.user.email);
  }
}
