import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AuthService } from './auth.service';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @MessagePattern({ cmd: 'auth.register' })
    async register(data: { email: string; password: string }) {
        return this.authService.register(data.email, data.password);
    }

    @MessagePattern({ cmd: 'auth.login' })
    async login(data: { email: string; password: string }) {
        return this.authService.login(data.email, data.password);
    }

    @MessagePattern({ cmd: 'auth.logout' })
    async logout(data: { token: string }) {
        return this.authService.logout(data.token);
    }

    @MessagePattern({ cmd: 'auth.validate' })
    async validate(data: { token: string }) {
        return this.authService.validateToken(data.token);
    }

    @MessagePattern({ cmd: 'auth.refresh' })
    async refresh(data: { refreshToken: string }) {
        return this.authService.refreshToken(data.refreshToken);
    }
}
