import { DebtGuarantor } from '@contact/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';

@Injectable()
export class GetDebtGuarantorService {
  constructor(
    @InjectModel(DebtGuarantor, 'contact')
    private readonly ModelDebtGuarantor: typeof DebtGuarantor,
  ) {}
  async get(id: number) {
    return this.ModelDebtGuarantor.findByPk(id);
  }
}
