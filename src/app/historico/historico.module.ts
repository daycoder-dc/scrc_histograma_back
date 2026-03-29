import { HistoricoController } from "./historico.controller";
import { HistoricoService } from "./historico.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

@Module({
  controllers: [
    HistoricoController
  ],
  providers: [
    HistoricoService
  ],
  imports: [
    TypeOrmModule.forFeature(),
    HttpModule
  ]
})
export class HistoricoModule {}
