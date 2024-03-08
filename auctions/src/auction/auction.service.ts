import { HttpException, Injectable } from '@nestjs/common';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { DataSource, Repository } from 'typeorm';
import { Auction } from './entities/auction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBidDto } from './dto/create-bid.dto';
import { Operation } from './entities/operation.entity';
import { Parcel } from './entities/parcel.entity';
import { CreateOperationDto } from './dto/create-operation.dto';
import { BidService } from './bid/bid.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
    @InjectRepository(Parcel)
    private readonly parcelRepository: Repository<Parcel>,
    private readonly bidService: BidService,
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
  ) {}
  async create(
    createAuctionDto: CreateAuctionDto,
    userEmail: string,
  ): Promise<Auction> {
    try {
      const user = await this.userService.findOne(userEmail);
      const { loadings, unloadings, ...auctionData } = createAuctionDto;
      let auction = this.auctionRepository.create(auctionData);
      auction.user = user;
      const savedAuction = await this.auctionRepository.save(auction);
      auction.loadings = await this.mergeOperations(
        loadings,
        'loading',
        savedAuction,
      );
      auction.unloadings = await this.mergeOperations(
        unloadings,
        'unloading',
        savedAuction,
      );
      // create cronjob for auction expiry
      auction = await this.auctionRepository.save(auction);
      return auction;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
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
    return await this.dataSource.transaction(async (manager) => {
      const operationsRepository = manager.getRepository(Operation);
      const parcelsRepository = manager.getRepository(Parcel);

      const _operations = operations.map(async (operationDto) => {
        const { parcels, ...data } = operationDto;
        const operation: Operation = operationsRepository.create(data);
        const savedOperation = await operationsRepository.save(operation);
        const savedParcels: Parcel[] = [];

        for (const parcel of parcels) {
          const parcelEntity = this.parcelRepository.create({
            height: parcel.height,
            width: parcel.width,
            length: parcel.length,
            weight: parcel.weight,
            qty: parcel.qty,
            fragile: parcel.fragile,
            description: parcel.description,
          });
          parcelEntity.operation = savedOperation;
          const savedParcel = await parcelsRepository.save(parcelEntity);
          savedParcels.push(savedParcel);
        }

        if (type === 'loading') {
          savedOperation.loadingFor = auctionData;
        } else if (type === 'unloading') {
          savedOperation.unloadingFor = auctionData;
        }

        savedOperation.parcels = savedParcels;
        const _operation = await operationsRepository.save(savedOperation);
        return _operation;
      });
      return await Promise.all(_operations);
    });
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
    userEmail: string,
  ): Promise<Auction> {
    const auction = await this.auctionRepository.findOneBy({
      id: id,
    });

    if (auction.finished === true) {
      throw new HttpException('Auction is finished', 400);
    }

    const bid = await this.bidService.create(createBidDto, userEmail);

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
