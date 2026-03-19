import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpExceptionFilter } from './config/http_exception';
import { Logger, LoggerErrorInterceptor } from "nestjs-pino"
import { AppModule } from './app/app.module';
import { NestFactory } from '@nestjs/core';
import cookie_parser from "cookie-parser";
import compression from "compression";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    autoFlushLogs: true,
    abortOnError: false,
    bufferLogs: true,
    rawBody: true
  });

  app.set("trust proxy", 1);
  app.setGlobalPrefix("api");

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableVersioning({type: VersioningType.URI});

  app.useBodyParser("urlencoded", { extended: true });
  app.useBodyParser("json", { limit: "50mb" });

  app.use(cookie_parser(process.env.SECRET));
  app.use(compression());

  app.enableCors({
    origin: ["*"],
    methods: ["GET", "POST", "PATCH", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  await app.listen(Number(process.env.PORT));
}

bootstrap();
