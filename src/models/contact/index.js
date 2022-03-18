import * as Dict from "./Dict";
import * as Portfolio from "./Portfolio";
import * as Person from "./Person";
import * as Debt from "./Debt";
import * as LawCourt from "./LawCourt";
import * as LawAct from "./LawAct";
import * as LawExec from "./LawExec";
const models = [Dict, Portfolio, Person, Debt, LawCourt, LawAct, LawExec];
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
