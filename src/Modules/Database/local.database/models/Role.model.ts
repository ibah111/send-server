import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from '@contact/sequelize';
import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from '@contact/sequelize-typescript';
import { User } from './User.model';
import { User_Role } from './User_Role.model';

@Table({ tableName: 'Roles' })
export class Role extends Model<
  InferAttributes<Role>,
  InferCreationAttributes<Role>
> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: CreationOptional<number>;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  title: string;

  @BelongsToMany(() => User, () => User_Role)
  Users?: NonAttribute<Array<User & { User_Role: User_Role }>>;
}
