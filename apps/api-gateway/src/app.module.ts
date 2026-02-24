import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthClientModule } from './common/modules/auth-client.module';
import { AuthModule } from './modules/auth/auth.module';
import { GameModule } from './modules/games/game.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      isGlobal: true,
    }),
    AuthClientModule,
    AuthModule,
    GameModule,
    UsersModule,
  ],
})
export class AppModule {}
