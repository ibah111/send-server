import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from '@sql-tools/sequelize';
import {
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from '@sql-tools/sequelize-typescript';
import { Role } from './Role.model';
import { User_Role } from './User_Role.model';

@Table({ tableName: 'Users' })
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;
  @Column(DataType.STRING)
  declare login: string;

  @BelongsToMany(() => Role, () => User_Role)
  declare Roles?: NonAttribute<Array<Role & { User_Role: User_Role }>>;
}
