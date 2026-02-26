import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { User } from '@repo/prisma';
import { UpdateUserDto } from '@repo/shared-types/dist/dto/users/update-user.dto';

import UsersService from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @MessagePattern({ cmd: 'user.getMe' })
    async getMe(data: { userId: string }): Promise<User> {
        return this.usersService.getMe(data.userId);
    }

    @MessagePattern({ cmd: 'user.deleteMe' })
    async deleteMe(data: { userId: string }): Promise<{ message: string }> {
        return this.usersService.deleteMe(data.userId);
    }

    @MessagePattern({ cmd: 'user.updateMe' })
    async updateUser(data: {
        userId: string;
        dto: UpdateUserDto;
    }): Promise<User> {
        return this.usersService.updateMe(data.userId, data.dto);
    }
}
