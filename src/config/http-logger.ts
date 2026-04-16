import { Request, Response } from "express";
import { LoggerModule } from "nestjs-pino";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        name: "API",
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
            return `${res.statusCode}`;
          }
        }
      }
    }),
  ],
  exports: [
    LoggerModule
  ]
})
export class HttpLogger { }
