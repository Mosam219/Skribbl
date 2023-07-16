import express from "express";
import { createServer } from "http";
import cors from "cors";
import { socketService } from "./services/SocketService";
import { gameHelperService } from "./services/GameServiceHelper";

const boot = (port: number) => {
  const app = express();
  app.use(
    cors({
      origin: ["http://localhost:3000"],
    })
  );
  const httpServer = createServer(app);
  socketService.init(httpServer);
  httpServer.listen(port, () => {
    console.log(`Server Listening on Port ${port}`);
  });
  // socketService.sendToAll(socketService., "/hey", "hello");
};

boot(process.env.PORT ? +process.env.PORT : 4000);
