import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        options: { host: 'localhost', port: 3001 },
        transport: Transport.TCP,
      },
    ]),
  ],
})
export class AuthModule {}
