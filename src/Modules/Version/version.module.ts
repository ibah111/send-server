import { Module } from '@nestjs/common';
import { VersionService } from './version.service';

@Module({
  providers: [
    {
      provide: VersionService,
      useFactory: async () => {
        const provider = new VersionService();
        await provider.init();
        return provider;
      },
    },
  ],
  exports: [VersionService],
})
export class VersionModule {}
