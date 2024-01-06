import { OperationDto } from './operation.dto';

export class AuctionDto {
  constructor(
    id: string,
    name: string,
    startTimestamp: Date,
    endTimestamp: Date,
    km: number,
    finished: boolean,
    active: boolean,
    loadings: OperationDto[],
    unloadings: OperationDto[],
  ) {
    this.id = id;
    this.name = name;
    this.startTimestamp = startTimestamp;
    this.endTimestamp = endTimestamp;
    this.km = km;
    this.finished = finished;
    this.active = active;
    this.loadings = loadings;
    this.unloadings = unloadings;
  }

  id: string;
  name: string;
  startTimestamp: Date;
  endTimestamp: Date;
  km: number;
  finished: boolean;
  active: boolean;
  loadings: OperationDto[];
  unloadings: OperationDto[];
}
