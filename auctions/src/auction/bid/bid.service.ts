import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from 'src/auction/entities/bid.entity';
import { CreateBidDto } from '../dto/create-bid.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BidService {
  constructor(
    @InjectRepository(Bid) private readonly bidRepository: Repository<Bid>,
    private readonly userService: UserService,
  ) {}

  async create(bidDto: CreateBidDto, userId: string) {
    const bid = this.bidRepository.create(bidDto);
    bid.user = await this.userService.findOne(userId);
    return await this.bidRepository.save(bid);
  }

  async findAll() {
    return await this.bidRepository.find();
  }

  async findOne(id: string) {
    return await this.bidRepository.findOneBy({ id: id });
  }

  async delete(id: string) {
    return await this.bidRepository.softDelete(id);
  }
}
