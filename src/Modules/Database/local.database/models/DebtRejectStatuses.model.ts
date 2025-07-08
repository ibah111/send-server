import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from '@sql-tools/sequelize';
import {
  Table,
  Column,
  Model,
  DataType,
  AutoIncrement,
  PrimaryKey,
} from '@sql-tools/sequelize-typescript';
import { IsNumber } from 'class-validator';
import { AllowNull } from 'sequelize-typescript';

@Table({ tableName: 'DebtRejectStatuses', timestamps: false })
export class DebtRejectStatuses extends Model<
  InferAttributes<DebtRejectStatuses>,
  InferCreationAttributes<DebtRejectStatuses>
> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @AllowNull(false)
  @IsNumber()
  @Column(DataType.INTEGER)
  declare reject_id: number;
}
