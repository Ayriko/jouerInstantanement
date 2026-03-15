import { Module } from '@nestjs/common';
import { WishlistModule } from './wishlists/wishlist.module';

@Module({
    imports: [WishlistModule],
})
export class AppModule {}
