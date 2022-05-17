import SMB2 from '@contact/smb2';
import { Injectable, Module } from '@nestjs/common';
import config from '../config/smb.json';
@Injectable()
export class SMB {
  private loader: SMB2;
  config = config;
  constructor() {
    this.loader = this.create_smb();
  }
  get() {
    return this.loader;
  }
  create_smb() {
    return new SMB2({
      share: this.config.share,
      domain: this.config.domain,
      username: this.config.username,
      password: this.config.password,
    });
  }
}
@Module({
  providers: [SMB],
  exports: [SMB],
})
export class SmbModule {}
