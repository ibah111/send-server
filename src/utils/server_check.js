import client from "./client";
import { Server } from "socket.io";
export default function ServerCheck() {
  const io = new Server({
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
  io.listen(client("wsPort"));
}
