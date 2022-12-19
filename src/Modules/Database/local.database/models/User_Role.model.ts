import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from '@contact/sequelize';
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
} from '@contact/sequelize-typescript';
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
  id: CreationOptional<number>;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  user_id: number;
  @BelongsTo(() => User)
  User?: NonAttribute<User>;

  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  role_id: number;
  @BelongsTo(() => Role)
  Role?: NonAttribute<Role>;
}
