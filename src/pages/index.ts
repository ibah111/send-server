import checkLogin from "../utils/check_login";
import * as login from "./login";
import * as get_comment from "./get_comment";
import * as add_comment from "./add_comment";
import * as dict from "./dict";
import * as court from "./court";
import * as search from "./search";
import * as search_la from "./search_la";
import * as law_exec from "./law_exec";
import * as create_exec from "./create_exec";
import * as update_exec from "./update_exec";
import * as delete_exec from "./delete_exec";
import { FastifyInstance, FastifyRequest } from "fastify";
import { Sql } from "../utils/sql";
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
  add_comment,
];
export default (fastify: FastifyInstance, sql: Sql) => {
  pages.forEach((page) => {
    fastify.post(
      "/" + page.name,
      async (req: FastifyRequest<{ Body: any }>) => {
        const user = await checkLogin(req.body.token, sql);
        if (user) {
          return await page.call(fastify, sql)(req, user);
        } else {
          return "Not Loged";
        }
      }
    );
  });
};
