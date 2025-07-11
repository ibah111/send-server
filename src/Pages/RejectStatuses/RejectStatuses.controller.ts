import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RejectStatusesService } from './RejectStatuses.service';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AddLawActRejectStatusDto } from './dto/add-law-act-reject-status.dto';
import { AddDebtRejectStatusDto } from './dto/add-debt-reject-status.dto';
import { AuthGuard } from 'src/Modules/Guards/auth.guard';

@ApiBasicAuth()
@UseGuards(AuthGuard)
@ApiTags('RejectStatuses')
@Controller('reject-statuses')
export class RejectStatusesController {
  constructor(private readonly rejectStatusesService: RejectStatusesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reject statuses' })
  @ApiResponse({
    status: 200,
    description: 'Return all reject statuses, of debt and law act',
  })
  async getAll() {
    return this.rejectStatusesService.getAll();
  }

  @Post('debt')
  @ApiOperation({ summary: 'Add debt reject status' })
  @ApiResponse({
    status: 200,
    description: 'Return added debt reject status',
  })
  public async addDebtRejectStatus(@Body() body: AddDebtRejectStatusDto) {
    return this.rejectStatusesService.addDebtRejectStatus(body.reject_id);
  }

  @ApiOperation({ summary: 'Add law act reject status' })
  @ApiResponse({
    status: 200,
    description: 'Return added law act reject status',
  })
  @Post('law-act')
  public async addLawActRejectStatus(@Body() body: AddLawActRejectStatusDto) {
    return this.rejectStatusesService.addLawActRejectStatus(body.reject_name);
  }
}
