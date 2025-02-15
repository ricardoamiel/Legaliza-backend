import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de middlewares y CORS
  // app.enableCors({ origin: ['http://localhost:3001'] });
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api');

  // Configurar el tiempo de espera de las solicitudes
  const server = app.getHttpAdapter().getInstance();
  server.timeout = 5000; // 5 segundos

  // Obtener el puerto desde el ConfigService o usar un valor por defecto
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 8080;

  await app.listen(PORT);
  console.log(`Application is running on: http://localhost:${PORT}`);
}

bootstrap();