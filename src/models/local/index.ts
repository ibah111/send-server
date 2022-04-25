import { Sequelize } from "@contact/sequelize/types";
import * as Group from "./Group";
import * as PermitRight from "./PermitRight";
import * as Right from "./Right";
import * as User from "./User";
const models = [
  Group,
  Right,
  User,
  PermitRight,
];
export default (sequelize:Sequelize) => {
  models.forEach((model) => {
    if (model.model) {
      model?.model(sequelize);
    }
  });
  models.forEach((model) => {
    if (model.join) {
      model?.join(sequelize);
    }
  });
  const result = models.map((model) => model.migrator);
  return result;
};
