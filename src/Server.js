import { Sequelize } from "@contact/sequelize";
import Fastify from "fastify";
import FastifyCors from "fastify-cors";
import FastifyMultipart from "fastify-multipart";
import models from "./models";
import pages from "./pages";
import client from "./utils/client";
import ServerCheck from "./utils/server_check";
import https from "./utils/https";
const fastify = Fastify({
  https,
});
const demo = true;
fastify.register(FastifyCors);
fastify.register(FastifyMultipart);
const sql = {
  local: new Sequelize({
    dialect: "sqlite",
    storage: "database.db",
  }),
  contact: new Sequelize("i_collect", "contact", "contact", {
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
