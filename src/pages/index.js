import checkLogin from "../utils/check_login";
import * as login from "./login";
const pages = [login];
/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {import("sequelize").Sequelize} sql
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
