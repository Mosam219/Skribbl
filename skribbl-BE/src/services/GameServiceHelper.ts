import { Socket } from "socket.io";
import { mapService } from "./MapService";
import Player from "../models/Player";
import Room from "../models/Room";
import fs from "fs";
import { random } from "lodash";

class GameHelperService {
  private static _instance: GameHelperService | null;
  private readonly wordList: string[];
  private constructor() {
    this.wordList = fs
      .readFileSync("src/utils/words.txt", "utf-8")
      .split(",\r\n");
  }
  public static getInstance(): GameHelperService {
    if (!GameHelperService._instance) {
      GameHelperService._instance = new GameHelperService();
    }
    return GameHelperService._instance;
  }

  public getPlayer = (socket: Socket) => {
    return mapService.getEntity<Player>(socket.id);
  };

  public getPlayerRoom = (player: Player) => {
    return mapService.getEntity<Room>(player.getRoomId());
  };

  public getPlayerAndRoom = (
    socket: Socket
  ): { room: Room; player: Player } | undefined => {
    const player = this.getPlayer(socket);
    if (!player) {
      console.log("player not found");
      return;
    }
    const room = this.getPlayerRoom(player);
    if (!room) {
      console.log("Room not found");
      return;
    }
    return { player, room };
  };

  public getRandomWords = () => {
    const index = random(0, this.wordList.length - 1);
    return [
      this.wordList[index],
      this.wordList[(index + 1) % this.wordList.length],
      this.wordList[(index + 2) % this.wordList.length],
    ];
  };
}

export const gameHelperService = GameHelperService.getInstance();
