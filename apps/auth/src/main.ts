import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      options: { host: '0.0.0.0', port: 3005 },
      transport: Transport.TCP,
    },
  );
  await app.listen();
  console.log('Auth microservice is listening on port 3005');
}

void bootstrap();
