import { Controller, UseFilters } from '@nestjs/common';

import { RpcExceptionFilter } from '../../common/filters/rpc-exception.filter';

@Controller('users')
@UseFilters(new RpcExceptionFilter())
export class UsersController {}
