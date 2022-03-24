import client from "./client";
import { Server } from "socket.io";
import https from "./https";
import { createServer } from "https";
export default function ServerCheck() {
  const httpServer = createServer(https);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", (socket) => {
    socket.on("version", (args) => {
      if (args !== client("version")) {
        socket.emit("new_version");
      }
    });
  });
  httpServer.listen(client("wsPort"));
}
