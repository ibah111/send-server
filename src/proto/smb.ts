/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "smb";

export interface LoginInput {
  domain: string;
  username: string;
  password: string;
  share: string;
}

export interface WriteFile {
  path: string;
  file: Buffer;
}

export interface WriteFileStream {
  path?: string | undefined;
  file?: Buffer | undefined;
}

export interface PathInput {
  path: string;
}

export interface MkdirInput {
  path: string;
  mode?: number | undefined;
}

export interface ReadDirInput {
  path: string;
  encoding?: string | undefined;
}

export interface ResultBool {
  result: boolean;
}

export interface ResultString {
  result: string;
}

export interface ResultArrayString {
  result: string[];
}

export interface ResultFile {
  result: Buffer;
}

export const SMB_PACKAGE_NAME = "smb";

export interface SmbServiceClient {
  login(request: LoginInput, metadata?: Metadata): Observable<ResultString>;

  exists(request: PathInput, metadata?: Metadata): Observable<ResultBool>;

  mkdir(request: MkdirInput, metadata?: Metadata): Observable<ResultBool>;

  readFile(request: PathInput, metadata?: Metadata): Observable<ResultFile>;

  writeFileStream(request: Observable<WriteFileStream>, metadata?: Metadata): Observable<ResultBool>;

  writeFile(request: WriteFile, metadata?: Metadata): Observable<ResultBool>;

  unlink(request: PathInput, metadata?: Metadata): Observable<ResultBool>;

  rmdir(request: PathInput, metadata?: Metadata): Observable<ResultBool>;

  readdir(request: ReadDirInput, metadata?: Metadata): Observable<ResultArrayString>;
}

export interface SmbServiceController {
  login(request: LoginInput, metadata?: Metadata): Promise<ResultString> | Observable<ResultString> | ResultString;

  exists(request: PathInput, metadata?: Metadata): Promise<ResultBool> | Observable<ResultBool> | ResultBool;

  mkdir(request: MkdirInput, metadata?: Metadata): Promise<ResultBool> | Observable<ResultBool> | ResultBool;

  readFile(request: PathInput, metadata?: Metadata): Observable<ResultFile>;

  writeFileStream(request: Observable<WriteFileStream>, metadata?: Metadata): Observable<ResultBool>;

  writeFile(request: WriteFile, metadata?: Metadata): Promise<ResultBool> | Observable<ResultBool> | ResultBool;

  unlink(request: PathInput, metadata?: Metadata): Promise<ResultBool> | Observable<ResultBool> | ResultBool;

  rmdir(request: PathInput, metadata?: Metadata): Promise<ResultBool> | Observable<ResultBool> | ResultBool;

  readdir(
    request: ReadDirInput,
    metadata?: Metadata,
  ): Promise<ResultArrayString> | Observable<ResultArrayString> | ResultArrayString;
}

export function SmbServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["login", "exists", "mkdir", "readFile", "writeFile", "unlink", "rmdir", "readdir"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("SmbService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = ["writeFileStream"];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("SmbService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const SMB_SERVICE_NAME = "SmbService";
