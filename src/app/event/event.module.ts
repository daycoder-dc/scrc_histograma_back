import { EventGateway } from "./event.gateway";
import { Module } from "@nestjs/common";

@Module({
  providers: [EventGateway],
  exports: [EventGateway]
})
export class EventModule {}
