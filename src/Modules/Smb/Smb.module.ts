import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SMBService } from './Smb.service';
import config from '../../config/smb.json';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    TerminusModule,
    ClientsModule.register([
      {
        name: 'SMB_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'smb',
          protoPath: 'src/proto/smb.proto',
          url: config.url,
        },
      },
    ]),
  ],
  providers: [SMBService],
  exports: [SMBService],
})
export class SmbModule {}
