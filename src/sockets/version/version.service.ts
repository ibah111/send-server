import { Injectable } from '@nestjs/common';
import gitSemverTags from 'git-semver-tags';
import s from 'semver';

const gitGet = (): Promise<string> =>
  new Promise((resolve) => {
    gitSemverTags({ tagPrefix: 'v' }, (err, result) => {
      const tags = result.map((value) => s.clean(value));
      resolve(tags[0]);
    });
  });

@Injectable()
export class VersionService {
  version: string;
  async init() {
    this.version = await gitGet();
  }
}
