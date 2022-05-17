import config from '../config/client.json';
export default (name) => {
  return config[name];
};
