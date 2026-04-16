import { MasterController } from "./master.controller";
import { MasterService } from "./master.service";
import { Module } from "@nestjs/common";

@Module({
  controllers: [MasterController],
  providers: [MasterService],
  imports: []
})
export class MasterModule { }
