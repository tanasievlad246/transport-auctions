import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ParcelType } from 'src/types/enums';

export class CreateParcelDto {
  @ApiProperty({
    description: 'Height',
    type: Number,
    example: 22.5,
  })
  @IsNumber()
  @IsNotEmpty()
  height: number;
  @ApiProperty({
    description: 'Width',
    type: Number,
    example: 22.5,
  })
  @IsNumber()
  @IsNotEmpty()
  width: number;
  @ApiProperty({
    description: 'Length',
    type: Number,
    example: 22.5,
  })
  @IsNumber()
  @IsNotEmpty()
  length: number;
  @ApiProperty({
    description: 'Weight',
    type: Number,
    example: 22.5,
  })
  @IsNumber()
  @IsNotEmpty()
  weight: number;
  @ApiProperty({
    description: 'Quantity',
    type: Number,
    example: 22.5,
  })
  @IsNumber()
  @IsNotEmpty()
  qty: number;
  @ApiProperty({
    description: 'Fragile',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  fragile: boolean;
  @ApiProperty({
    description: 'Description',
    type: String,
    example: 'Parcel description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
  @ApiProperty({
    type: String,
    enum: ParcelType,
    example: ParcelType.PALLET,
  })
  @IsEnum(ParcelType)
  type: string;
}
