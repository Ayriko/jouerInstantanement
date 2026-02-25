import {
    Body,
    Controller,
    Get,
    Inject,
    Patch,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from '@repo/shared-types/dist/dto/users/update-user.dto';
import { Observable } from 'rxjs';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RpcExceptionFilter } from '../../common/filters/rpc-exception.filter';
import { JwtAuthGuard } from '../../common/guards/auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
@UseFilters(new RpcExceptionFilter())
export class UsersController {
    constructor(
        @Inject('USERS_SERVICE') private readonly userClient: ClientProxy,
    ) {}

    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ description: 'Return the authenticated user', status: 200 })
    getMe(
        @CurrentUser() user: { id: string; email: string },
    ): Observable<unknown> {
        return this.userClient.send({ cmd: 'user.getMe' }, { userId: user.id });
    }

    @Patch('me')
    @ApiOperation({ summary: 'Update current user profile' })
    @ApiResponse({
        description: 'Return the authenticated user updated',
        status: 200,
    })
    updateMe(
        @CurrentUser() user: { id: string; email: string },
        @Body() dto: UpdateUserDto,
    ): Observable<unknown> {
        return this.userClient.send(
            { cmd: 'user.updateMe' },
            { dto, userId: user.id },
        );
    }

    @Patch('delete/me')
    @ApiOperation({ summary: 'Soft delete current user profile' })
    @ApiResponse({ description: 'User successfully deleted', status: 200 })
    deleteMe(@CurrentUser() user: { id: string; email: string }) {
        return this.userClient.send(
            { cmd: 'user.deleteMe' },
            { userId: user.id },
        );
    }
}
