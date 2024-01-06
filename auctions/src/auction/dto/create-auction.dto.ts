import { ApiProperty } from '@nestjs/swagger';
import { CreateOperationDto } from './create-operation.dto';
import { ParcelType } from 'src/types/enums';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateAuctionDto {
  @ApiProperty({
    description: 'Auction name',
    type: String,
    example: 'Auction name',
  })
  @IsString()
  @MinLength(8)
  name: string;
  @ApiProperty({
    description: 'Auction start date',
    type: Date,
    example: '2021-01-01 00:00:00',
  })
  @IsDateString()
  @IsNotEmpty()
  startTimestamp: Date;
  @ApiProperty({
    description: 'Auction end date',
    type: Date,
    example: '2021-02-01 00:00:00',
  })
  @IsDateString()
  @IsNotEmpty()
  endTimestamp: Date;
  @ApiProperty({
    description: 'Auction km',
    type: Number,
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  km: number;
  @ApiProperty({
    description: 'Array of operations for loadings',
    example: [
      {
        street: 'Street',
        number: '1',
        city: 'City',
        country: 'Country',
        dock: 'Dock',
        coordinates: 'Coordinates',
        parcels: [
          {
            height: 100,
            width: 100,
            weight: 100,
            length: 100,
            fragile: false,
            description: 'Parcel description',
            qty: 100,
            type: ParcelType.BOX,
          },
        ],
        description: 'Description',
        executionDate: '2021-01-01 00:00:00',
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  loadings: CreateOperationDto[];
  @ApiProperty({
    description: 'Array of operations for unloadings',
    example: [
      {
        street: 'Street',
        number: '1',
        city: 'City',
        country: 'Country',
        dock: 'Dock',
        coordinates: 'Coordinates',
        parcels: [
          {
            height: 100,
            width: 100,
            weight: 100,
            length: 100,
            fragile: false,
            description: 'Parcel description',
            qty: 100,
            type: ParcelType.BOX,
          },
        ],
        description: 'Description',
        executionDate: '2021-01-01 00:00:00',
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  unloadings: CreateOperationDto[];
}
