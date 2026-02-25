import { NestFactory } from '@nestjs/core';

import { AuthModule } from './auth.module';

async function bootstrap() {
    const app = await NestFactory.create(AuthModule, { bodyParser: false });
    await app.listen(3002);
    console.log('Auth HTTP server running on http://localhost:3002');
}

void bootstrap();
