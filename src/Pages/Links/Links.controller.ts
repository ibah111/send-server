import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import LinksService from './Links.service';
import LinkInput, { AddLinkInput } from './Links.input';
@ApiTags('Links')
@Controller('Links')
export default class LinksController {
  constructor(private readonly service: LinksService) {}

  @Post('addLink')
  async addLink(@Body() body: AddLinkInput) {
    return await this.service.addLink(body);
  }

  @Post('deleteLink')
  async deleteLinks(@Body() body: LinkInput) {
    return await this.service.deleteLink(body);
  }

  @Post('getLinks')
  async getLinks() {
    return await this.service.getLinks();
  }
}
