import fs from "fs";
import path from "path";
import { dirname } from "path";
import process from "process";
const __dirname = process.cwd();
export default {
  key: fs.readFileSync(path.join(__dirname, "https", "fastify.key")),
  cert: fs.readFileSync(path.join(__dirname, "https", "fastify.crt")),
};
