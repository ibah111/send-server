import { node } from 'src/main';
import config from '../config/server.json';
export default (name = 'url') => {
  switch (name) {
    case 'fastreport':
      return node === 'prod' ? config.fastreport : config.fastreport_dev;
    case 'token':
    case 'oauth':
      return config[name];
    default:
      return config.server;
  }
};
