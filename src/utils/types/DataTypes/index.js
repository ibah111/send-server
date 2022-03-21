//export {default as BASE} from "./BASE";
import { default as MONEY } from "./MONEY";
import { default as NUMERIC } from "./NUMERIC";
import { default as VARCHAR } from "./VARCHAR";
export default function Types(Sequelize) {
  MONEY(Sequelize);
  NUMERIC(Sequelize);
  VARCHAR(Sequelize);
}
