import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import LinksService from './Links.service';
import LinkInput from './Links.input';
@ApiTags('Links')
@Controller('Links')
export default class LinksController {
  constructor(private readonly service: LinksService) {}

  @Post('addLink')
  async addLink(@Body() body: LinkInput) {
    return await this.service.addLink(body);
  }

  @Post('deleteLinks')
  async deleteLinks(@Body() body: LinkInput) {
    return await this.service.deleteLink(body);
  }

  @Post('getLinks')
  async getLinks() {
    return await this.service.getLinks();
  }
}
