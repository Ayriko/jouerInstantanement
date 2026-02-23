import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RpcExceptionFilter } from './common/filters/rpc-exception.filter';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new RpcExceptionFilter());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés non déclarées dans le DTO
      forbidNonWhitelisted: true, // Rejette les requêtes avec des propriétés inconnues
      transform: true, // Transforme automatiquement les types
      transformOptions: {
        enableImplicitConversion: false, // Force la validation stricte des types
      },
    }),
  );

  // Configuration Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Jouer Instantanément Swagger API')
    .setDescription('API pour la plateforme de vente de clés de jeux')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
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
