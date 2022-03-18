import checkLogin from "../utils/check_login";
import * as login from "./login";
import * as dict from "./dict";
import * as court from "./court";
import * as search from "./search";
import * as search_la from "./search_la";
import * as law_exec from "./law_exec";
const pages = [login, dict, court, search, law_exec, search_la];

/**
 * @typedef {Object} Sql
 * @property {import("sequelize").Sequelize} Sql.local
 * @property {import("sequelize").Sequelize} Sql.contact
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
