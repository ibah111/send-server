import { Metadata } from '@grpc/grpc-js';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, GrpcOptions } from '@nestjs/microservices';
import { GRPCHealthIndicator } from '@nestjs/terminus';
import {
  catchError,
  concatMap,
  from,
  lastValueFrom,
  map,
  Observable,
  of,
  retry,
  tap,
  toArray,
} from 'rxjs';
import { SmbServiceClient } from 'src/proto/smb';
import { Readable } from 'stream';
import config from '../../config/smb.json';
interface GrpcError {
  code: number;
  details: string;
  metadata: Metadata;
}
function isGrpcError(e: unknown): e is GrpcError {
  return (
    Object.prototype.hasOwnProperty.call(e, 'code') &&
    Object.prototype.hasOwnProperty.call(e, 'details')
  );
}
@Injectable()
export class SMBService implements OnModuleInit {
  private smbClient: SmbServiceClient;
  private meta: Metadata;
  constructor(
    @Inject('SMB_PACKAGE') private client: ClientGrpc,
    private readonly health: GRPCHealthIndicator,
  ) {}
  onModuleInit() {
    this.meta = new Metadata();
    this.smbClient = this.client.getService<SmbServiceClient>('SmbService');
    return lastValueFrom(
      this.smbClient.login(config.credentials).pipe(
        tap((result) => {
          this.meta.set('token', result.result);
        }),
      ),
    );
  }
  authRetry<T>() {
    return retry<T>({
      delay: (e) =>
        of(e).pipe(
          concatMap((e) => {
            if (e instanceof Error)
              if (isGrpcError(e))
                return this.smbClient.login(config.credentials).pipe(
                  tap((result) => {
                    this.meta.set('token', result.result);
                  }),
                );

            throw e;
          }),
        ),
    });
  }
  getHealth(key: string) {
    return this.health.checkService<GrpcOptions>(key, 'SmbService', {
      url: config.url,
      healthServiceName: 'Health',
      healthServiceCheck: (healthService, service) => {
        return healthService
          .check({ service }, this.meta)
          .pipe(this.authRetry())
          .toPromise();
      },
    });
  }
  exists(path: string): Observable<boolean> {
    return this.smbClient
      .exists({ path }, this.meta)
      .pipe(this.authRetry())
      .pipe(map((res) => res.result));
  }
  mkdir(path: string, mode?: number): Observable<boolean> {
    return this.smbClient
      .mkdir({ path, mode }, this.meta)
      .pipe(this.authRetry())
      .pipe(map((res) => res.result));
  }
  readFileStream(path: string): Readable {
    const data = new Readable({
      read: () => {
        this.smbClient
          .readFile({ path }, this.meta)
          .pipe(this.authRetry())
          .pipe(map((res) => res.result))
          .subscribe({
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
      },
    });
    return data;
  }
  readFile(path: string): Observable<Buffer> {
    return this.smbClient
      .readFile({ path }, this.meta)
      .pipe(this.authRetry())
      .pipe(
        map((res) => res.result),
        toArray(),
        map((items) => Buffer.concat(items)),
      );
  }
  writeFile(path: string, file: Buffer): Observable<boolean> {
    return this.smbClient
      .writeFile({ path, file }, this.meta)
      .pipe(this.authRetry())
      .pipe(map((res) => res.result));
  }

  unlink(path: string): Observable<boolean> {
    return this.smbClient
      .unlink({ path }, this.meta)
      .pipe(this.authRetry())
      .pipe(map((res) => res.result));
  }

  rmdir(path: string): Observable<boolean> {
    return this.smbClient
      .rmdir({ path }, this.meta)
      .pipe(this.authRetry())
      .pipe(map((res) => res.result));
  }
  readdir(path: string, encoding?: string): Observable<string[]> {
    return this.smbClient
      .readdir({ path, encoding }, this.meta)
      .pipe(this.authRetry())
      .pipe(map((res) => res.result));
  }
}
