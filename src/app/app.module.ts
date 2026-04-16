import { DatabaseConnection } from "@/config/database-connection";
import { HistoricoModule } from "./historico/historico.module";
import { SocketGateway } from "@/config/socket-gateway";
import { MasterModule } from "./master/master.module";
import { HttpLogger } from "@/config/http-logger";
import { Module } from '@nestjs/common';

@Module({
  imports: [
    DatabaseConnection,
    HistoricoModule,
    MasterModule,
    HttpLogger,
  ],
  providers: [
    SocketGateway
  ]
})
export class AppModule { }
