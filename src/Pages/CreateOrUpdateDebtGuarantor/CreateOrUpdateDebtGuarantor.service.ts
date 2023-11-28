import { Address, DebtGuarantor } from '@contact/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import {
  CreateOrUpdateAddress,
  CreateOrUpdateDebtGuarantorInput,
} from './CreateOrUpdateDebtGuarantor.input';
function objectKeys<T extends object>(obj: T) {
  return Object.keys(obj) as Array<keyof typeof obj>;
}
function UpdateValue<T extends object, K extends keyof T, V extends T[K]>(
  data: T,
  key: K,
  value: V,
): void {
  data[key] = value;
}
@Injectable()
export class CreateOrUpdateDebtGuarantorService {
  constructor(
    @InjectModel(DebtGuarantor, 'contact')
    private readonly ModelDebtGuarantor: typeof DebtGuarantor,
    @InjectModel(Address, 'contact')
    private readonly ModelAddress: typeof Address,
  ) {}
  async get(body: CreateOrUpdateDebtGuarantorInput) {
    if (body.id) {
      const data = await this.ModelDebtGuarantor.findByPk(body.id);
      if (data) {
        for (const key of objectKeys(body)) {
          if (key !== 'id') {
            const value = body[key];
            if (value !== undefined) UpdateValue(data, key, value);
          }
        }
        await data.save();
        return new HttpException({ update: true }, HttpStatus.OK);
      }
    } else {
      const data = await this.ModelDebtGuarantor.create(body);
      return new HttpException(data, HttpStatus.CREATED);
    }
  }
  async address(body: CreateOrUpdateAddress) {
    if (body.id) {
      const data = await this.ModelAddress.findByPk(body.id);
      if (data) {
        for (const key of objectKeys(body)) {
          if (key !== 'id') {
            const value = body[key];
            if (value !== undefined) UpdateValue(data, key, value);
          }
        }
        await data.save();
        return new HttpException({ update: true }, HttpStatus.OK);
      }
    } else {
      const data = await this.ModelAddress.create(body);
      return new HttpException(data, HttpStatus.CREATED);
    }
  }
}
