import checkLogin from "../utils/check_login";
import * as login from "./login";
import * as dict from "./dict";
import * as court from "./court";
const pages = [login, dict, court];

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
        return await page.call(fastify, sql)(req, user.id);
      } else {
        return "Not Loged";
      }
    });
  });
};
