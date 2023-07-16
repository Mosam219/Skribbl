import { io } from "socket.io-client";
import { Socket } from "socket.io-client";

class SocketService {
  private static __instance: SocketService | null;
  private socket: Socket | null = null;
  private URL = "http://localhost:4000/";

  public static getInstance(): SocketService {
    if (!SocketService.__instance)
      SocketService.__instance = new SocketService();
    return SocketService.__instance;
  }
  public init(): void {
    this.socket = io(this.URL, {
      transports: ["websocket"],
    });

    console.log("[Web Socket Service] initialized");
  }
  public emitEvent(event: string, message: unknown): void {
    this.socket?.emit(event, message);
  }
  public registerEvent(event: string, handler: (e: any) => void): void {
    this.socket?.on(event, handler);
  }
}

export const socketService = SocketService.getInstance();
