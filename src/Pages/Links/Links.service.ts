import { Injectable } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import LinkInput, { AddLinkInput } from './Links.input';
import { Link } from 'src/Modules/Database/send.server.database/server.models/Link.model';

@Injectable()
export default class LinksService {
  constructor(
    @InjectModel(Link, 'send')
    private readonly modelLink: typeof Link,
  ) {}

  async addLink(body: AddLinkInput) {
    return await this.modelLink
      .create({
        ...body,
      })
      .then(() => true);
  }

  async deleteLink({ id }: LinkInput) {
    return await this.modelLink.destroy({
      where: {
        id,
      },
    });
  }

  async getLinks() {
    return await this.modelLink.findAll();
  }
}
