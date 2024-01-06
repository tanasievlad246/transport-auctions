import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Auction } from 'src/auction/entities/auction.entity';
import { Bid } from 'src/auction/entities/bid.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Auction, Bid])],
  controllers: [UserController, AuthController],
  providers: [UserService, AuthService],
})
export class UserModule {}
