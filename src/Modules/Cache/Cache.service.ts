import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { KeyDto } from './dto/key.dto';
import { Cache as CacheManager } from 'cache-manager';
import { SetDto } from './dto/set.dto';

@Injectable()
export default class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly cache = new Map<string, any>();

  constructor(@Inject(CACHE_MANAGER) private cacheManager: CacheManager) {}

  async get({ key }: KeyDto) {
    return await this.cacheManager.get(key);
  }

  async set({ key, value, ttl }: SetDto) {
    return await this.cacheManager.set(key, value, ttl);
  }

  async del({ key }: KeyDto) {
    await this.cacheManager.del(key);
  }
}
