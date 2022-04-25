import local from "./local";
import contact from "./contact";
import { Sequelize } from "@contact/sequelize";
type types = "local" | "contact";
export default function Models(sql: Sequelize, type: types) {
  switch (type) {
    case "local":
      return local(sql);
    case "contact":
      return contact(sql);
    default:
      return "Error";
  }
}
