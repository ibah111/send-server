import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import {
  CreateOrUpdateAddress,
  CreateOrUpdateDebtGuarantorInput,
} from './CreateOrUpdateDebtGuarantor.input';
import { CreateOrUpdateDebtGuarantorService } from './CreateOrUpdateDebtGuarantor.service';

export class TestUpdate {
  @Expose()
  @IsNotEmpty()
  id: string;
}

@Controller('create_or_update_debt_guarantor')
export class CreateOrUpdateDebtGuarantorController {
  constructor(private readonly service: CreateOrUpdateDebtGuarantorService) {}
  @HttpCode(200)
  @Post()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { excludeExtraneousValues: true },
    }),
  )
  get(@Body() body: CreateOrUpdateDebtGuarantorInput) {
    return this.service.get(body);
  }
  @Post('address')
  address(@Body() body: CreateOrUpdateAddress) {
    return this.service.address(body);
  }
}
