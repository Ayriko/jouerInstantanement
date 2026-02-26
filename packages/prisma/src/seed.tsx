import { Game, PrismaClient } from './generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import data from './formatted-games.json' with { type: 'json' };

type GameWithoutId = Omit<Game, 'id'>;
dotenv.config({ path: `${__dirname}/../../../.env` });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const games: GameWithoutId[] = data;

async function main() {
    console.log('Seeding games...');
    await prisma.game.deleteMany();
    const result = await prisma.game.createMany({ data: games });
    console.log(`Seeded ${result.count} games.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
