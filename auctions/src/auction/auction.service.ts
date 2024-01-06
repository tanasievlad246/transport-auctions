import { HttpException, Injectable } from '@nestjs/common';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { Repository } from 'typeorm';
import { Auction } from './entities/auction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBidDto } from './dto/create-bid.dto';
import { Operation } from './entities/operation.entity';
import { Parcel } from './entities/parcel.entity';
import { CreateOperationDto } from './dto/create-operation.dto';
import { BidService } from './bid/bid.service';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
    @InjectRepository(Operation)
    private readonly operationRepository: Repository<Operation>,
    @InjectRepository(Parcel)
    private readonly parcelRepository: Repository<Parcel>,
    private readonly bidService: BidService,
  ) {}
  async create(createAuctionDto: CreateAuctionDto) {
    const { loadings, unloadings, ...auctionData } = createAuctionDto;
    const auction = this.auctionRepository.create(auctionData);
    auction.loadings = await this.mergeOperations(loadings, 'loading', auction);
    auction.unloadings = await this.mergeOperations(
      unloadings,
      'unloading',
      auction,
    );
    return await this.auctionRepository.save(auction);
  }

  /**
   * Flattens the operations and parcels arrays and saves them to the database
   * Returns the saved operations to be attached to the auction
   */
  private async mergeOperations(
    operations: CreateOperationDto[],
    type: 'loading' | 'unloading',
    auctionData: Auction,
  ): Promise<Operation[]> {
    const _operations = operations.map(async (operationDto) => {
      const { parcels, ...data } = operationDto;
      const operation = this.operationRepository.create(data);

      for (const parcel of parcels) {
        const parcelEntity = this.parcelRepository.create();
        parcelEntity.height = parcel.height;
        parcelEntity.width = parcel.width;
        parcelEntity.length = parcel.length;
        parcelEntity.weight = parcel.weight;
        parcelEntity.qty = parcel.qty;
        parcelEntity.fragile = parcel.fragile;
        parcelEntity.operation = operation;
        const savedParcel = await this.parcelRepository.save(parcelEntity);
        operation.parcels.push(savedParcel);
      }

      if (type === 'loading') {
        operation.loadingFor = auctionData;
      } else if (type === 'unloading') {
        operation.unloadingFor = auctionData;
      }

      return await this.operationRepository.save(operation);
    });
    return await Promise.all(_operations);
  }

  async findAll() {
    return await this.auctionRepository.find();
  }

  async findOne(id: string) {
    return await this.auctionRepository.findOneBy({
      id: id,
    });
  }

  async update(
    id: string,
    updateAuctionDto: UpdateAuctionDto,
  ): Promise<Auction> {
    const auction = await this.auctionRepository.findOneBy({
      id: id,
    });
    const updateAuction = Object.assign(auction, updateAuctionDto);
    return await this.auctionRepository.save(updateAuction);
  }

  async remove(id: number) {
    return await this.auctionRepository.softDelete(id);
  }

  async addBid(
    id: string,
    createBidDto: CreateBidDto,
    userId: string,
  ): Promise<Auction> {
    const auction = await this.auctionRepository.findOneBy({
      id: id,
    });

    if (auction.finished === true) {
      throw new HttpException('Auction is finished', 400);
    }

    const bid = await this.bidService.create(createBidDto, userId);

    auction.bids.push(bid);

    return await this.auctionRepository.save(auction);
  }

  async cancelBid(id: string, bidId: string): Promise<Auction> {
    const auction = await this.auctionRepository.findOneBy({
      id: id,
    });

    if (auction.finished === true) {
      throw new HttpException('Auction is finished', 400);
    }

    const bid = await this.bidService.findOne(bidId);

    auction.bids = auction.bids.filter((b) => b.id !== bid.id);

    return await this.auctionRepository.save(auction);
  }

  async cancelAuction(id: string): Promise<Auction> {
    const auction = await this.auctionRepository.findOneBy({
      id: id,
    });

    if (auction.finished === true) {
      throw new HttpException('Auction is finished', 400);
    }

    auction.finished = true;

    return await this.auctionRepository.save(auction);
  }
}
