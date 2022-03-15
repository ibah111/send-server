import config from "../../config/client" assert { type: "json" };
export default (name) => {
  return config[name];
};
