import { ApiProperty } from '@nestjs/swagger';
import { CreateParcelDto } from './create-parcel.dto';
import { IsArray, IsDate, IsNotEmpty, IsString } from 'class-validator';
import { ParcelType } from 'src/types/enums';

export class CreateOperationDto {
  @ApiProperty({
    description: 'Street',
    type: String,
    example: 'Street',
  })
  @IsString()
  @IsNotEmpty()
  street: string;
  @ApiProperty({
    description: 'Number',
    type: String,
    example: 'A1',
  })
  @IsString()
  @IsNotEmpty()
  number: string;
  @ApiProperty({
    description: 'City',
    type: String,
    example: 'City',
  })
  @IsString()
  @IsNotEmpty()
  city: string;
  @ApiProperty({
    description: 'Country',
    type: String,
    example: 'Romania',
  })
  @IsString()
  @IsNotEmpty()
  country: string;
  @ApiProperty({
    description: 'Dock',
    type: String,
    example: 'Dock',
  })
  @IsString()
  @IsNotEmpty()
  dock: string;
  @ApiProperty({
    description: 'Coordinates',
    type: String,
    example: 'Coordinates',
  })
  @IsString()
  @IsNotEmpty()
  coordinates: string;
  @ApiProperty({
    description: 'Array of parcels',
    example: [
      {
        height: 100,
        width: 100,
        weight: 100,
        fragile: false,
        description: 'Parcel description',
        qty: 100,
        type: ParcelType.BOX,
      },
    ],
  })
  @IsArray({
    message: 'Parcels must be an array',
  })
  parcels: CreateParcelDto[];
  @ApiProperty({
    description: 'Description',
    type: String,
    example: 'Description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
  @ApiProperty({
    description: 'Execution date',
    type: Date,
    example: '2021-01-01 00:00:00',
  })
  @IsDate()
  @IsNotEmpty()
  executionTime: Date;
}
