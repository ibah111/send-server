import { Metadata } from '@grpc/grpc-js';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, GrpcOptions } from '@nestjs/microservices';
import { GRPCHealthIndicator } from '@nestjs/terminus';
import { lastValueFrom, map, Observable, tap, toArray } from 'rxjs';
import { SmbServiceClient } from 'src/proto/smb';
import { Readable } from 'stream';
import config from '../../config/smb.json';
@Injectable()
export class SMBService implements OnModuleInit {
  private smbClient: SmbServiceClient;
  private meta: Metadata;
  constructor(
    @Inject('SMB_PACKAGE') private client: ClientGrpc,
    private readonly health: GRPCHealthIndicator,
  ) {}
  onModuleInit() {
    this.smbClient = this.client.getService<SmbServiceClient>('SmbService');
    return lastValueFrom(
      this.smbClient.login(config.credentials).pipe(
        tap((result) => {
          const meta = new Metadata();
          meta.set('token', result.result);
          this.meta = meta;
        }),
      ),
    );
  }
  getHealth(key: string) {
    return this.health.checkService<GrpcOptions>(key, 'SmbService', {
      url: config.url,
      healthServiceName: 'Health',
      healthServiceCheck: (healthService, service) => {
        return healthService.check({ service }, this.meta).toPromise();
      },
    });
  }
  exists(path: string): Observable<boolean> {
    return this.smbClient
      .exists({ path }, this.meta)
      .pipe(map((res) => res.result));
  }
  mkdir(path: string, mode?: number): Observable<boolean> {
    return this.smbClient
      .mkdir({ path, mode }, this.meta)
      .pipe(map((res) => res.result));
  }
  readFileStream(path: string): Readable {
    const data = new Readable({
      read: () => {
        return;
      },
    });
    this.smbClient.readFile({ path }, this.meta).subscribe({
      next: (value) => {
        data.push(value);
      },
      error: (e) => {
        data.destroy(e);
      },
      complete: () => {
        data.push(null);
      },
    });
    return data;
  }
  readFile(path: string): Observable<Buffer> {
    return this.smbClient.readFile({ path }, this.meta).pipe(
      map((res) => res.result),
      toArray(),
      map((items) => Buffer.concat(items)),
    );
  }
  writeFile(path: string, file: Buffer): Observable<boolean> {
    return this.smbClient
      .writeFile({ path, file }, this.meta)
      .pipe(map((res) => res.result));
  }

  unlink(path: string): Observable<boolean> {
    return this.smbClient
      .unlink({ path }, this.meta)
      .pipe(map((res) => res.result));
  }

  rmdir(path: string): Observable<boolean> {
    return this.smbClient
      .rmdir({ path }, this.meta)
      .pipe(map((res) => res.result));
  }
  readdir(path: string, encoding?: string): Observable<string[]> {
    return this.smbClient
      .readdir({ path, encoding }, this.meta)
      .pipe(map((res) => res.result));
  }
}
