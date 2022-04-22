import checkLogin from "../utils/check_login";
import * as login from "./login";
import * as get_comment from "./get_comment";
import * as dict from "./dict";
import * as court from "./court";
import * as search from "./search";
import * as search_la from "./search_la";
import * as law_exec from "./law_exec";
import * as create_exec from "./create_exec";
import * as update_exec from "./update_exec";
import * as delete_exec from "./delete_exec";
const pages = [
  login,
  dict,
  court,
  search,
  law_exec,
  search_la,
  create_exec,
  update_exec,
  delete_exec,
  get_comment,
];

/**
 * @typedef {Object} Sql
 * @property {import("@contact/sequelize").Sequelize} Sql.local
 * @property {import("@contact/sequelize").Sequelize} Sql.contact
 */

/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {Sql} sql
 */
export default (fastify, sql) => {
  pages.forEach((page) => {
    fastify.post("/" + page.name, async (req) => {
      const user = await checkLogin(req, sql);
      if (user) {
        return await page.call(fastify, sql)(req, user);
      } else {
        return "Not Loged";
      }
    });
  });
};
