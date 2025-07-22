import { Controller, Logger, Module, Post } from '@nestjs/common';
@Controller('restart')
export class RestartController {
  private readonly logger = new Logger(RestartController.name);

  @Post()
  restart() {
    this.logger.debug('Restarting server...');
    process.exit(0);
  }
}

@Module({ controllers: [RestartController] })
export class RestartModule {}
