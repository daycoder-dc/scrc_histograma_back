import { TypeOrmModule } from "@nestjs/typeorm";
import { Historico } from "@/entity/historico";
import { minutes } from "@nestjs/throttler";
import { Maestro } from "@/entity/maestro";
import { Archivo } from "@/entity/archivo";
import { Module } from "@nestjs/common";
import { Mapa } from "@/entity/mapa";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST!,
      port: parseInt(process.env.DB_PORT!),
      username: process.env.DB_USER!,
      password: process.env.DB_PASS!,
      database: process.env.DB_NAME!,
      synchronize: process.env.DB_SYNC == "true",
      logging: false,
      poolSize: 10,
      cache: {
        type: "redis",
        duration: minutes(5),
        options: {
          host: process.env.RD_HOST!,
          port: parseInt(process.env.RD_PORT!),
          password: process.env.RD_PASS!
        }
      },
      entities: [
        Historico,
        Archivo,
        Maestro,
        Mapa
      ],
    }),
  ],
  exports: [
    TypeOrmModule
  ]
})
export class DatabaseConnection { }
