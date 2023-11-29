import { Injectable, OnModuleInit } from '@nestjs/common';
import gitSemverTags from 'git-semver-tags';
import { first, from, lastValueFrom, map, mergeMap, tap } from 'rxjs';
import s from 'semver';

/**
 * Сервис версии
 */
@Injectable()
export class VersionService implements OnModuleInit {
  /**
   * Версия
   */
  version: string;
  /**
   * Инициализировать сервис
   */
  async onModuleInit() {
    await lastValueFrom(
      from(gitSemverTags({ tagPrefix: 'v' })).pipe(
        mergeMap((items) => items),
        map((item) => s.clean(item)),
        first(),
        tap((item) => {
          console.log(item);
          this.version = item as string;
        }),
      ),
    );
  }
}
