import { Sequelize } from "sequelize";
import types from "./utils/types";
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
types(Sequelize);
const sql = {
  local: new Sequelize({
    dialect: "sqlite",
    storage: "database.db",
  }),
  contact: new Sequelize("i_collect_test", "contact", "contact", {
    host: "newct.usb.ru",
    dialect: "mssql",
  }),
};
const migrates = {
  local: models(sql.local, "local"),
  contact: models(sql.contact, "contact"),
};
pages(fastify, sql);
const start = async () => {
  await sql.local.sync();
  await sql.contact.sync();
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
