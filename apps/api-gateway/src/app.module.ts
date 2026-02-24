import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { GameModule } from './modules/games/game.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthClientModule } from './common/modules/auth-client.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    AuthClientModule,
    AuthModule,
    GameModule,
    UsersModule,
  ],
})
export class AppModule {}
