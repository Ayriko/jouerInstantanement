import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService, User } from '@repo/prisma';
import { UpdateUserDto } from '@repo/shared-types/dist/dto/users/update-user.dto';

@Injectable()
class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async getMe(userId: string): Promise<User> {
        const user = await this.prisma.user.findFirst({
            where: { id: userId, deletedAt: null },
        });
        if (!user) {
            throw new RpcException({
                message: 'User not found',
                statusCode: 404,
            });
        }
        return user;
    }

    async updateMe(
        userId: string,
        updateUserDto: UpdateUserDto,
    ): Promise<User> {
        const existing = await this.prisma.user.findFirst({
            where: { id: userId, deletedAt: null },
        });
        if (!existing) {
            throw new RpcException({
                message: 'User not found',
                statusCode: 404,
            });
        }
        try {
            return await this.prisma.user.update({
                data: {
                    ...(updateUserDto.email !== undefined && {
                        email: updateUserDto.email,
                    }),
                    ...(updateUserDto.image !== undefined && {
                        image: updateUserDto.image,
                    }),
                    ...(updateUserDto.name !== undefined && {
                        name: updateUserDto.name,
                    }),
                },
                where: { id: userId },
            });
        } catch (err) {
            console.error('[updateMe] Prisma error:', err);
            throw new RpcException({
                message: 'Failed to update user',
                statusCode: 500,
            });
        }
    }

    async deleteMe(userId: string): Promise<{ message: string }> {
        const existing = await this.prisma.user.findFirst({
            where: { id: userId, deletedAt: null },
        });
        if (!existing) {
            throw new RpcException({
                message: 'User not found',
                statusCode: 404,
            });
        }
        await this.prisma.user.update({
            data: { deletedAt: new Date() },
            where: { id: userId },
        });
        return { message: 'User successfuly deleted' };
    }
}

export default UsersService;
