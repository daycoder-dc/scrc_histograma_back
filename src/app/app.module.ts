import { HistoricoModule } from "./historico/historico.module";
import { MasterModule } from "./master/master.module";
import { EventModule } from "./event/event.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Request, Response } from "express";
import { LoggerModule } from "nestjs-pino";
import { Module } from '@nestjs/common';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        name: "histograma",
        autoLogging: true,
        transport: {
          target: "pino-pretty",
          options: {
            colorize: false,
            igonre: "pid,hostname",
            translateTime: "SYS:HH:MM:ss",
            singleLine: true
          }
        },
        serializers: {
          req(req: Request) {
            return `${req.method} - ${req.url}`;
          },
          res(res: Response) {
            return `status - ${res.statusCode}`;
          }
        }
      }
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      synchronize: false,
      logging: false
    }),
    HistoricoModule,
    MasterModule,
    EventModule
  ]
})
export class AppModule { }
