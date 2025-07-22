import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { KeyDto } from './dto/key.dto';
import CacheService from './Cache.service';
import { ApiTags } from '@nestjs/swagger';
import { SetDto } from './dto/set.dto';

@ApiTags('Cache')
@Controller('cache')
export default class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Get('/:key')
  async get(@Param() key: KeyDto) {
    return this.cacheService.get(key);
  }

  @Post('/')
  async set(@Body() setDto: SetDto) {
    return this.cacheService.set(setDto);
  }

  @Delete('/:key')
  async del(@Param() key: KeyDto) {
    return this.cacheService.del(key);
  }
}
