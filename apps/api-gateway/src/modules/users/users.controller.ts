()import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  UseGuards,
  UseFilters,
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
import { RpcExceptionFilter } from '../../common/filters/rpc-exception.filter';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

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
  @ApiResponse({ status: 200, description: 'Return the authenticated user' })
  getMe(
    @CurrentUser() user: { id: string; email: string },
  ): Observable<unknown> {
    return this.userClient.send({ cmd: 'user.getMe' }, { userId: user.id });
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Return the authenticated user updated',
  })
  updateMe(
    @CurrentUser() user: { id: string; email: string },
    @Body() dto: UpdateUserDto,
  ): Observable<unknown> {
    return this.userClient.send(
      { cmd: 'user.updateMe' },
      { userId: user.id, dto },
    );
  }

  @Patch('delete/me')
  @ApiOperation({ summary: 'Soft delete current user profile' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  deleteMe(@CurrentUser() user: { id: string; email: string }) {
    return this.userClient.send({ cmd: 'user.deleteMe' }, { userId: user.id });
  }
}
