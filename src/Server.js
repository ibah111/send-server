import { Sequelize } from "sequelize";
import Fastify from "fastify";
import sequelizeHierarchy from "@motivation/sequelize-hierarchy";
import FastifyCors from "fastify-cors";
import models from "./models";
import pages from "./pages";
import client from "./utils/client";
import ServerCheck from "./utils/server_check";
const fastify = Fastify({
  logger: true,
});
fastify.register(FastifyCors);
sequelizeHierarchy(Sequelize);
const sql = new Sequelize({
  dialect: "sqlite",
  storage: "database.db",
});
models(sql);
pages(fastify, sql);
const start = async () => {
  await sql.sync();
  ServerCheck();
  await fastify.listen(client("httpPort"), "0.0.0.0");
};
start();
