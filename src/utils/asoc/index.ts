import { simple } from "./simple";
import { complex } from "./complex";
import { complex_many } from "./complex_many";
import { polym } from "./polym";
import { ModelK } from "./types";
export const asoc = (
  DBfrom: ModelK,
  DBto: ModelK,
  options: any,
  type = "simple"
) => {
  switch (type) {
    case "simple":
      return simple(DBfrom, DBto, options);
    case "complex":
      return complex(DBfrom, DBto, options);
    case "complex_many":
      return complex_many(DBfrom, DBto, options);
    case "polym":
      return polym(DBfrom, DBto, options);
    default:
      return simple(DBfrom, DBto, options);
  }
};
