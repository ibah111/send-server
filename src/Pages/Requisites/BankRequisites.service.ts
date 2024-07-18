import { Injectable } from '@nestjs/common';
import { BankRequisits } from '@contact/models';
@Injectable()
export default class BankRequisitesService {
  constructor(private readonly modelBankRequisites: typeof BankRequisits) {}
  async getAllRequisites() {
    const requisites = await this.modelBankRequisites.findAll();
    return requisites;
  }

  async addBankRequisites() {
    const requisites = this.modelBankRequisites.build();
    requisites.save();
  }

  async updateBankRequisites() {
    const currentRequisites = await this.modelBankRequisites.findOne({
      rejectOnEmpty: true,
    });
    return await currentRequisites
      .update({})
      .then((result) => {
        if (result) return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }
}
