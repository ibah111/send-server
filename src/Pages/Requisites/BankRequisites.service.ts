import { Injectable } from '@nestjs/common';
import { BankRequisits } from '@contact/models';
import { BankRequisitesClass } from './BankRequisites.input';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
@Injectable()
export default class BankRequisitesService {
  constructor(
    @InjectModel(BankRequisits, 'contact')
    private readonly modelBankRequisites: typeof BankRequisits,
  ) {}
  attributes = [
    'id',
    'name',
    'recipient',
    'br_name',
    'inn',
    'kpp',
    'r_account',
    'bik',
    'k_account',
    'pay_purpose',
    'br_address',
    'typ',
    'kbe',
    'knp',
    'kod',
  ];
  async getAllRequisites() {
    const requisites = await this.modelBankRequisites.findAll({
      attributes: this.attributes,
    });
    return requisites;
  }

  async getOneBankRequisites(id: number) {
    const requisite = await this.modelBankRequisites.findByPk(id, {
      attributes: this.attributes,
    });
    return requisite;
  }

  async addBankRequisites(b: BankRequisitesClass) {
    const requisites = this.modelBankRequisites.build();
    requisites.name = b.name;
    requisites.recipient = b.recipient;
    requisites.br_name = b.br_name;
    requisites.inn = b.inn;
    requisites.bik = b.bik;
    requisites.r_account = b.r_account;
    requisites.k_account = b.k_account;
    requisites.pay_purpose = b.pay_purpose;
    requisites.br_address = b.br_address;
    requisites.kpp = b.kpp;
    requisites.typ = b.typ;
    requisites.kbe = b.kbe;
    requisites.knp = b.knp;
    requisites.kod = b.kod;
    await requisites.save();
  }

  async updateBankRequisites(id: number, body: BankRequisitesClass) {
    const currentRequisites = await this.modelBankRequisites.findOne({
      rejectOnEmpty: true,
      where: {
        id,
      },
    });
    await currentRequisites.update({
      ...body,
    });
  }
}
