import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import PortfoliosToRequisitesService from './PortfoliosToRequisites.service';
import { ArrayNotEmpty, IsNumber } from 'class-validator';

class CreateLinkInput {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  r_requisites_id: number;
  @ApiProperty({
    required: true,
  })
  @ArrayNotEmpty()
  r_portfolio_ids: number[];
}

@ApiTags('PortfoliosToRequisites')
@Controller('PortfoliosToRequisites')
export default class PortfoliosToRequisitesController {
  constructor(
    private readonly portfolioService: PortfoliosToRequisitesService,
  ) {}

  @Get('getAllLinksByRequisites/:id')
  getAllLinksByRequisites(@Param('id', ParseIntPipe) requisites_id: number) {
    const port_id = Number(requisites_id);
    return this.portfolioService.getAllLinksByRequisites(port_id);
  }

  @Get('getRequisitesByPortfolio/:id')
  getRequisitesByPortfolio(@Param('id', ParseIntPipe) portfolio_id: number) {
    const port_id = Number(portfolio_id);
    return this.portfolioService.getRequisitesByPortfolio(port_id);
  }

  @Post('createPortfolioToRequisitesLink')
  createPortfolioToRequisitesLink(@Body() body: CreateLinkInput) {
    return this.portfolioService.createPortfolioToRequisitesLink({
      ...body,
    });
  }
}
