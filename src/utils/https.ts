import fs from "fs";
import path from "path";
import process from "process";
const _dirname = process.cwd();
export default {
  key: fs.readFileSync(path.join(_dirname, "https", "fastify.key")),
  cert: fs.readFileSync(path.join(_dirname, "https", "fastify.crt")),
};
