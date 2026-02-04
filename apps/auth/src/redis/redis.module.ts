import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RedisService } from './redis.service';

@Global()
@Module({
  exports: [RedisService],
  imports: [ConfigModule],
  providers: [RedisService],
})
export class RedisModule {}
