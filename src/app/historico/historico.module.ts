import { HistoricoController } from "./historico.controller";
import { SocketGateway } from "../../config/socket-gateway";
import { HistoricoService } from "./historico.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    TypeOrmModule,
    HttpModule,
  ],
  controllers: [
    HistoricoController
  ],
  providers: [
    HistoricoService,
    SocketGateway,
  ]
})
export class HistoricoModule { }
