import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RejectStatusesService } from './RejectStatuses.service';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LawActRejectStatusDto } from './dto/law-act-reject-status.dto';
import { DebtRejectStatusDto } from './dto/debt-reject-status.dto';
import { AuthGuard } from 'src/Modules/Guards/auth.guard';

@UseGuards(AuthGuard)
@ApiBasicAuth()
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
  public async addDebtRejectStatus(@Body() body: DebtRejectStatusDto) {
    return this.rejectStatusesService.addDebtRejectStatus(body.reject_id);
  }

  @ApiOperation({ summary: 'Add law act reject status' })
  @ApiResponse({
    status: 200,
    description: 'Return added law act reject status',
  })
  @Post('law-act')
  public async addLawActRejectStatus(@Body() body: LawActRejectStatusDto) {
    return this.rejectStatusesService.addLawActRejectStatus(body.reject_name);
  }

  @Delete('debt')
  @ApiOperation({ summary: 'Delete debt reject status' })
  @ApiResponse({
    status: 200,
    description: 'Return 1 if debt reject status deleted',
  })
  public async deleteDebtRejectStatus(@Body() body: DebtRejectStatusDto) {
    return this.rejectStatusesService.deleteDebtRejectStatus(body.reject_id);
  }

  @Delete('law-act')
  @ApiOperation({ summary: 'Delete law act reject status' })
  @ApiResponse({
    status: 200,
    description: 'Return 1 if law act reject status deleted',
  })
  public async deleteLawActRejectStatus(@Body() body: LawActRejectStatusDto) {
    return this.rejectStatusesService.deleteLawActRejectStatus(
      body.reject_name,
    );
  }
}
