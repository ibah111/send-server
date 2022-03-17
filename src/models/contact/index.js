import * as Dict from "./Dict";
import * as LawCourt from "./LawCourt";
const models = [Dict, LawCourt];
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
