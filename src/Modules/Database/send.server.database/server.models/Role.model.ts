import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from '@sql-tools/sequelize';
import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from '@sql-tools/sequelize-typescript';
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
  declare id: CreationOptional<number>;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare title: string;

  @BelongsToMany(() => User, () => User_Role)
  declare Users?: NonAttribute<Array<User & { User_Role: User_Role }>>;
}
