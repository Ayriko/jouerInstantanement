import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.enableCors({
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
  });

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true, // Rejette les requêtes avec des propriétés inconnues
      transform: true, // Transforme automatiquement les types
      transformOptions: {
        enableImplicitConversion: false, // Force la validation stricte des types
      },
      whitelist: true, // Supprime les propriétés non déclarées dans le DTO
    }),
  );

  // Configuration Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Jouer Instantanément Swagger API')
    .setDescription('API pour la plateforme de vente de clés de jeux')
    .setVersion('1.0')
    .addBearerAuth({ bearerFormat: 'JWT', scheme: 'bearer', type: 'http' })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port);
  console.log(`API Gateway running on http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/docs`);
}

void bootstrap();
