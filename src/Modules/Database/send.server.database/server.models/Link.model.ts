import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from '@sql-tools/sequelize';
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from '@sql-tools/sequelize-typescript';

@Table({ tableName: 'Links' })
export class Link extends Model<
  InferAttributes<Link>,
  InferCreationAttributes<Link>
> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare item_name: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare item_url: string;
}
