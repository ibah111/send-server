import config from '../config/client.json';
export default function client<T extends keyof typeof config>(name: T) {
  return config[name];
}
