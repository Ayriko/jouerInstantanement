import { Injectable } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/client.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    //TODO move to PgAdapter
    const adapter = new PrismaBetterSqlite3({ url: ':memory:'});
    super({ adapter });
  }
}
