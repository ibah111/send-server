import {
  Column,
  Model,
  PrimaryKey,
  Table,
  AutoIncrement,
  AllowNull,
} from '@sql-tools/sequelize-typescript';
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from '@sql-tools/sequelize';
import { DataType } from '@sql-tools/sequelize-typescript';

@Table({ tableName: 'LawActRejectStatuses', timestamps: false })
export default class LawActRejectStatuses extends Model<
  InferAttributes<LawActRejectStatuses>,
  InferCreationAttributes<LawActRejectStatuses>
> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare reject_name: string;
}
