import { Sequelize } from '@sql-tools/sequelize-typescript';
import generateContext from './generateContext';

export default async function getContextTransaction(
  sequelize: Sequelize,
  user: number,
) {
  const transaction = await sequelize.transaction();
  await sequelize.query(generateContext(user), { transaction });
  return transaction;
}
