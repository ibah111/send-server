import local from "./local";
import contact from "./contact";
export default function Models(sql, type) {
  switch (type) {
    case "local":
      return local(sql);
    case "contact":
      return contact(sql);
    default:
      return "Error";
  }
}
