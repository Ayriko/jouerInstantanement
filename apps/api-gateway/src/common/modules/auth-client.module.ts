import { Global, Module } from '@nestjs/common';

import { JwtAuthGuard } from '../guards/auth.guard';

@Global()
@Module({
    providers: [JwtAuthGuard],
    exports: [JwtAuthGuard],
})
export class AuthClientModule {}
