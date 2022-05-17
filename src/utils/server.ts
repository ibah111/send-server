import config from '../config/server.json';
export default (name = 'url') => {
  let prot;
  switch (name) {
    case 'token':
      return config.token;
    case 'fastreport':
      return config.fastreport;
    default:
      switch (config.protocol) {
        case 'http':
          prot = 'http';
          break;
        case 'ssl':
          prot = 'https';
          break;
        default:
          prot = 'http';
          break;
      }
      return `${prot}://${config.server}${
        config.port === '80' ? '' : `:${config.port}`
      }`;
  }
};
