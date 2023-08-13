import { Socket } from "socket.io";
import { gameHelperService } from "./GameServiceHelper";
import { socketService } from "./SocketService";
import { EventEnum } from "../Enums/eventEnum";
import Room from "../models/Room";

class RoundService {
  private static __instance: RoundService | null;
  public static getInstance = (): RoundService => {
    if (!this.__instance) this.__instance = new RoundService();
    return this.__instance;
  };

  public wordReveal = (socket: Socket, word: string) => {
    const roomAndPlayer = gameHelperService.getPlayerAndRoom(socket);
    if (!roomAndPlayer) {
      console.log("Room or Player not found");
      return;
    }
    this.roundSync(socket, word);
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
        word: chosenWord,
        choosing: false,
        round_start: true,
        word_length: chosenWord.length,
      });
    }
  };

  public gameChat = (socket: Socket, msg: string) => {
    console.log(msg);
    const roomAndPlayer = gameHelperService.getPlayerAndRoom(socket);
    if (!roomAndPlayer) return;
    const { room, player } = roomAndPlayer;
    socketService.sendToRoom(socket, EventEnum.CHAT, room.id, {
      message: msg,
      userId: player.id,
    });
  };
}
export const roundService = RoundService.getInstance();
