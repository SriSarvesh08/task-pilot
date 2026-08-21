import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Enable CORS for frontend communication
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');
  const allowedOrigins = corsOrigin.split(',').map(o => o.trim());
  
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      // Check against allowed origins list
      if (allowedOrigins.some(allowed => origin === allowed || origin.endsWith('.vercel.app'))) {
        return callback(null, true);
      }
      callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  await app.listen(port);
  console.log(`🚀 TaskPilot API running on http://localhost:${port}`);
}

bootstrap();
