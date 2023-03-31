import { Controller, Module, Post } from '@nestjs/common';
@Controller('restart')
export class RestartController {
  @Post()
  restart() {
    process.kill(process.pid, 'SIGTERM');
  }
}

@Module({ controllers: [RestartController] })
export class RestartModule {}
