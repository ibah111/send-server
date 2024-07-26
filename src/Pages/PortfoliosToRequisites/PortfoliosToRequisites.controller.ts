import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import PortfoliosToRequisitesService from './PortfoliosToRequisites.service';
import { IsNumber } from 'class-validator';

class CreateLinkInput {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  requisites_id: number;
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  portfolio_id: number;
}

@ApiTags('PortfoliosToRequisites')
@Controller('PortfoliosToRequisites')
export default class PortfoliosToRequisitesController {
  constructor(
    private readonly portfolioService: PortfoliosToRequisitesService,
  ) {}

  @Get('getAllPortfolio')
  getAllPortfolio() {
    return this.portfolioService.getAllPortfolio();
  }

  @Get('getAllLinksByRequisites/:id')
  getAllLinksByRequisites(@Param(':id') requisites_id: number) {
    return this.portfolioService.getAllLinksByRequisites(requisites_id);
  }

  @Get('getRequisitesByPortfolio/:id')
  getRequisitesByPortfolio(@Param(':id') portfolio_id: number) {
    return this.portfolioService.getRequisitesByPortfolio(portfolio_id);
  }

  @Post('createPortfolioToRequisitesLink')
  createPortfolioToRequisitesLink(@Body() body: CreateLinkInput) {
    return this.portfolioService.createPortfolioToRequisitesLink({
      ...body,
    });
  }
}
