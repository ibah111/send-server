import { Address, DebtGuarantor } from '@contact/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';

@Injectable()
export class GetDebtGuarantorService {
  constructor(
    @InjectModel(DebtGuarantor, 'contact')
    private readonly ModelDebtGuarantor: typeof DebtGuarantor,
    @InjectModel(Address, 'contact')
    private readonly ModelAddress: typeof Address,
  ) {}
  get(id: number) {
    return this.ModelDebtGuarantor.findByPk(id);
  }
  getAddress(id: number) {
    return this.ModelAddress.findAll({
      where: { r_debt_guarantor_id: id },
      include: ['TypDict'],
    });
  }
}
