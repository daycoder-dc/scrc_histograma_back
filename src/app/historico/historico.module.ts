import { HistoricoController } from "./historico.controller";
import { HistoricoService } from "./historico.service";
import { EventModule } from "@/app/event/event.module";
import { EventGateway } from "../event/event.gateway";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    TypeOrmModule.forFeature(),
    HttpModule,
    EventModule
  ],
  controllers: [
    HistoricoController
  ],
  providers: [
    HistoricoService,
    EventGateway,
  ]
})
export class HistoricoModule {}
