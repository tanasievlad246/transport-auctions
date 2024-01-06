import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBidDto {
  @ApiProperty({
    description: 'Bid amount',
    type: Number,
    example: 1000,
  })
  @IsNumber()
  @IsNotEmpty()
  bidAmount: number;
  @ApiProperty({
    description: 'Bid of start date of pickup',
    type: Date,
    example: '2021-09-28T00:00:00.000Z',
  })
  @IsDate()
  @IsNotEmpty()
  startDate: Date;
  @ApiProperty({
    description: 'Bid of end date of pickup',
    type: Date,
    example: '2021-09-28T00:00:00.000Z',
  })
  @IsDate()
  @IsNotEmpty()
  endDate: Date;
  @ApiProperty({
    description: 'uuid of the auction',
    type: String,
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsString()
  @IsNotEmpty()
  auctionId: string;
}
