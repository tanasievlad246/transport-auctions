import { OperationStatus } from 'src/types/enums';
import { Parcel } from '../entities/parcel.entity';

export class OperationDto {
  constructor(
    id: string,
    street: string,
    number: string,
    city: string,
    country: string,
    dock: string,
    coordinates: string,
    parcels: Parcel[],
    description: string,
    executionDate: Date,
    createdAt: Date,
    status: OperationStatus,
  ) {
    this.id = id;
    this.street = street;
    this.number = number;
    this.city = city;
    this.country = country;
    this.dock = dock;
    this.coordinates = coordinates;
    this.parcels = parcels;
    this.description = description;
    this.executionDate = executionDate;
    this.createdAt = createdAt;
    this.status = status;
  }

  id: string;
  street: string;
  number: string;
  city: string;
  country: string;
  dock: string;
  coordinates: string;
  parcels: Parcel[];
  description: string;
  executionDate: Date;
  createdAt: Date;
  status: OperationStatus;
}
