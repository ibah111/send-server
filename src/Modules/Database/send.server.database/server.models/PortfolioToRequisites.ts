import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from '@sql-tools/sequelize';
import {
  AllowNull,
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
} from '@sql-tools/sequelize-typescript';

@Table({
  tableName: 'PortfoliosToRequisites',
  paranoid: true,
})
export class PortfoliosToRequisites extends Model<
  InferAttributes<PortfoliosToRequisites>,
  InferCreationAttributes<PortfoliosToRequisites>
> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataTypes.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  r_portfolio_id: number;

  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  r_requisites_id: number;
}
