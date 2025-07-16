import { Global, Module } from '@nestjs/common';
import CacheController from './Cache.controller';
import CacheService from './Cache.service';
import { CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [CacheModule.register({ ttl: 60000 })],
  controllers: [CacheController],
  providers: [CacheService],
  exports: [CacheService],
})
export class LocalCacheModule {}
