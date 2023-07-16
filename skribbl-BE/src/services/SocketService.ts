import { Server as httpServer } from "http";
import { Server, Socket } from "socket.io";
import { GameHandlers } from "../handlers/GameHandlers";

class SocketService {
  private static __instance: SocketService | null;
  private io: Server | null = null;

  public static getInstance(): SocketService {
    if (!SocketService.__instance)
      SocketService.__instance = new SocketService();
    return SocketService.__instance;
  }

  public init(server: httpServer): void {
    this.io = new Server(server, {
      transports: ["websocket"],
      cors: {
        origin: ["http://localhost:3000"],
      },
    });
    this.io.on("connection", (socket) => {
      GameHandlers.drawMessage(socket);
      GameHandlers.createGame(socket);
      GameHandlers.joinGame(socket);
      GameHandlers.startGame(socket);
      GameHandlers.wordReveal(socket);
      GameHandlers.gameRoundSyncHandler(socket);
    });
  }

  public sendToAll = (socket: Socket, event: string, message: any) => {
    socket.broadcast.emit(event, message);
  };

  public sendPrivate = (socket: Socket, event: string, message: any) => {
    this.io?.to(socket.id).emit(event, message);
  };

  public sendToRoom = (
    socket: Socket,
    event: string,
    roomId: string,
    message: any
  ) => {
    socket.to(roomId).emit(event, message);
  };
}

export const socketService = SocketService.getInstance();
