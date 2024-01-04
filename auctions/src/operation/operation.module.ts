import { Module } from '@nestjs/common';
import { OperationService } from './operation.service';
import { OperationController } from './operation.controller';
import { ParcelService } from './parcel/parcel.service';

@Module({
  controllers: [OperationController],
  providers: [OperationService, ParcelService],
})
export class OperationModule {}
