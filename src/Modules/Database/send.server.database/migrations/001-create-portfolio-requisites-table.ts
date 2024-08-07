import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = ({ context }) =>
  context.sequelize.transaction((t) =>
    Promise.all([
      context.createTable(
        'PortfoliosToRequisites',
        {
          id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          r_requisites_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          r_portfolio_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
          updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
          deletedAt: {
            type: DataTypes.DATE,
          },
        },
        { transaction: t },
      ),
    ]),
  );
export const down: MigrationFn<QueryInterface> = ({ context }) =>
  context.sequelize.transaction((t) =>
    Promise.all([
      context.dropTable('PortfoliosToRequsites', { transaction: t }),
    ]),
  );
