import config from "../../config/client.json";
export default (name:string) => {
  return (config as any)[name];
};
