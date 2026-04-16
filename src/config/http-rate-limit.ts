import { ThrottlerStorageRedisService } from "@nest-lab/throttler-storage-redis";
import { minutes, seconds, ThrottlerModule } from "@nestjs/throttler";
import { Module } from "@nestjs/common";
import Redis from "ioredis"

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: "short",
          ttl: seconds(1),
          limit: 3,
          blockDuration: minutes(1)
        },
        {
          name: "medium",
          ttl: seconds(10),
          limit: 20,
          blockDuration: minutes(5)
        },
        {
          name: "long",
          ttl: seconds(60),
          limit: 100,
          blockDuration: minutes(15)
        }
      ],
      storage: new ThrottlerStorageRedisService(new Redis({
        host: process.env.RD_HOST!,
        port: parseInt(process.env.RD_PORT!)
      }))
    })
  ]
})
export class HttpRateLimit { }
