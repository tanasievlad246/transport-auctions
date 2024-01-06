import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/user/auth/auth.guard';
import { CreateBidDto } from './dto/create-bid.dto';
import { Request } from 'express';
import { Auction } from './entities/auction.entity';
import { AuctionDto } from './dto/auction.dto';

@ApiTags('auctions')
@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
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

  private convertAuctionToResponse(auction: Auction): Promise<AuctionDto> {
    const { loadings, unloadings, ...auctionData } = auction;

    const _loadings = loadings.map((operation) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { loadingFor, unloadingFor, ...rest } = operation;
      return rest;
    });

    const _unloadings = unloadings.map((operation) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { loadingFor, unloadingFor, ...rest } = operation;
      return rest;
    });

    const auctionDto = new AuctionDto(
      auctionData.id,
      auctionData.name,
      auctionData.startTimestamp,
      auctionData.endTimestamp,
      auctionData.km,
      auctionData.finished,
      auctionData.active,
      _loadings,
      _unloadings,
    );

    return new Promise((resolve) => resolve(auctionDto));
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
