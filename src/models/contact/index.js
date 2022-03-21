import * as Dict from "./Dict";
import * as Portfolio from "./Portfolio";
import * as Person from "./Person";
import * as Debt from "./Debt";
import * as LawCourt from "./LawCourt";
import * as LawAct from "./LawAct";
import * as LawExec from "./LawExec";
import * as User from "./User";
import * as WorkTask from "./WorkTask";
import * as LawExecProtokol from "./LawExecProtokol";
import * as LawExecPersonLink from "./LawExecPersonLink";
const models = [
  Dict,
  User,
  Portfolio,
  Person,
  Debt,
  WorkTask,
  LawCourt,
  LawAct,
  LawExec,
  LawExecProtokol,
  LawExecPersonLink
];
export default (sequelize) => {
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
