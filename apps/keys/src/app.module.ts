import { Module } from '@nestjs/common';

import { KeysModule } from './keys/keys.module';

@Module({
    imports: [KeysModule],
})
export class AppModule {}
