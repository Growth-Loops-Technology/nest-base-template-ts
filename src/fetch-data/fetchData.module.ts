import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FetchDataService } from './fetchData.service';
import { FetchDataController } from './fetchData.controller';
// Import all schemas
import { Class, ClassSchema } from '../class/class.schema';
import { Location, LocationSchema } from '../location/location.schema';
import { Staff, StaffSchema } from '../staff/staff.schema';
import { Client, ClientSchema } from '../client/client.schema';
import { Membership, MembershipSchema } from '../membership/membership.schema';
import { Program, ProgramSchema } from '../program/program.schema';
import { Purchase, PurchaseSchema } from '../purchase/purchase.schema';
import { SessionType, SessionTypeSchema } from '../session/session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Class.name, schema: ClassSchema },
      { name: Location.name, schema: LocationSchema },
      { name: Staff.name, schema: StaffSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Membership.name, schema: MembershipSchema },
      { name: Program.name, schema: ProgramSchema },
      { name: Purchase.name, schema: PurchaseSchema },
      { name: SessionType.name, schema: SessionTypeSchema },
    ]),
  ],
  controllers: [FetchDataController],
  providers: [FetchDataService],
  exports: [FetchDataService],
})
export class FetchDataModule {}
