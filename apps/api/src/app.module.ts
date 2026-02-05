import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LinksModule } from './links/links.module';
import { GameModule } from './game/game.module';

@Module({
  controllers: [AppController],
  imports: [AuthModule, LinksModule, GameModule],
  providers: [AppService],
})
export class AppModule {}
