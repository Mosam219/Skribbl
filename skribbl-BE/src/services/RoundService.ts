import { Socket } from "socket.io";
import { gameHelperService } from "./GameServiceHelper";
import { socketService } from "./SocketService";
import { EventEnum } from "../Enums/eventEnum";

class RoundService {
  private static __instance: RoundService | null;
  public static getInstance = (): RoundService => {
    if (!this.__instance) this.__instance = new RoundService();
    return this.__instance;
  };

  public wordReveal = (socket: Socket) => {
    const roomAndPlayer = gameHelperService.getPlayerAndRoom(socket);
    if (!roomAndPlayer) {
      console.log("Room or Player not found");
      return;
    }
    
  };

  public roundSync = (socket: Socket, chosenWord?: string) => {
    const playerAndRoom = gameHelperService.getPlayerAndRoom(socket);
    if (!playerAndRoom) {
      console.log("Room or player not found");
      return;
    }
    const { player, room } = playerAndRoom;
    if (!player || !room) {
      return;
    }
    if (chosenWord && chosenWord.trim() !== "") {
      room.setCurrentWord(chosenWord);
      socketService.sendToRoom(socket, EventEnum.ROUND_SYNC, room.id, {
        choosing: false,
        round_start: true,
        word_length: chosenWord.length,
      });
    }
  };
}
export const roundService = RoundService.getInstance();
