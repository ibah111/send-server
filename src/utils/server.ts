import config from '../config/server.json';
export default (name = 'url') => {
  let prot;
  switch (name) {
    case 'token':
    case 'fastreport':
    case 'oauth':
      return config[name];
    default:
      return config.server;
  }
};
