import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpExceptionFilter } from './config/http-exception';
import { Logger, LoggerErrorInterceptor } from "nestjs-pino"
import { AppModule } from './app/app.module';
import { RedisStore } from "connect-redis";
import { NestFactory } from '@nestjs/core';
import cookieParser from "cookie-parser";
import compression from "compression";
import session from "express-session";
import { createClient } from "redis";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    autoFlushLogs: true,
    abortOnError: false,
    bufferLogs: true,
    logger: false,
    rawBody: true
  });

  const logger = app.get(Logger);

  const redis = createClient({
    socket: {
      host: process.env.RD_HOST!,
      port: parseInt(process.env.RD_PORT!),
    },
    password: process.env.RD_PASS!
  });

  await redis.connect();

  app.set("trust proxy", "loopback");
  app.setGlobalPrefix("api");

  app.enableCors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
    prefix: "v"
  });

  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useBodyParser("urlencoded", { extended: true });
  app.use(compression({ level: 6, threshold: 1024 }));
  app.useBodyParser("json", { limit: "50mb" });
  app.use(cookieParser(process.env.SECRET));

  app.use(session({
    store: new RedisStore({ client: redis }),
    proxy: process.env.ENV != "dev",
    cookie: {
      httpOnly: true,
      secure: process.env.ENV != "dev",
      sameSite: process.env.ENV != "dev" ? "none" : "lax",
      path: "/"
    },
    secret: process.env.SECRET!,
    resave: false,
    saveUninitialized: false,
  }))

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  const swagger_config = new DocumentBuilder()
    .setTitle("SCR Dashboard")
    .setDescription("Documentación")
    .addApiKey()
    .setVersion("1.0")
    .build();

  const swagger = SwaggerModule.createDocument(app, swagger_config);

  SwaggerModule.setup("docs", app, swagger, {
    customSiteTitle: "API Documentation",
    jsonDocumentUrl: "swagger/json",
    useGlobalPrefix: true,
  });

  await app.listen(Number(process.env.PORT!), () => {
    logger.log(`Server is running on http://localhost:${process.env.PORT}`);
  });
}

bootstrap();
