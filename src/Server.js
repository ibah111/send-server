import { Sequelize } from "sequelize";
import Fastify from "fastify";
import FastifyCors from "fastify-cors";
import models from "./models";
import pages from "./pages";
import client from "./utils/client";
import ServerCheck from "./utils/server_check";
const fastify = Fastify({
  logger: true,
});
const demo = true;
fastify.register(FastifyCors);
const sql = {
  local: new Sequelize({
    dialect: "sqlite",
    storage: "database.db",
  }),
};
const migrates = { local: models(sql.local, "local") };
pages(fastify, sql);
const start = async () => {
  await sql.local.sync();
  for (const model of migrates.local) {
    if (model.migrate) {
      await model.migrate(sql.local);
    }
  }
  if (demo) {
    for (const model of migrates.local) {
      if (model.demo) {
        await model.demo(sql.local);
      }
    }
  } else {
    for (const model of migrates.local) {
      if (model.production) {
        await model.production(sql.local);
      }
    }
  }
  ServerCheck();
  await fastify.listen(client("httpPort"), "0.0.0.0");
};
start();
