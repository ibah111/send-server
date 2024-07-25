import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from '@sql-tools/sequelize';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from '@sql-tools/sequelize-typescript';
import { Role } from './Role.model';
import { User } from './User.model';

@Table({ tableName: 'Users_Roles' })
export class User_Role extends Model<
  InferAttributes<User_Role>,
  InferCreationAttributes<User_Role>
> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare user_id: number;
  @BelongsTo(() => User)
  declare User?: NonAttribute<User>;

  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare role_id: number;
  @BelongsTo(() => Role)
  declare Role?: NonAttribute<Role>;
}
