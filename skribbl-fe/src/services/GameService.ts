import { Socket } from "socket.io-client";
import { socketService } from "./SocketService";
import { Player } from "../types/player.types";
import { EventEnum } from "../Enums/EventEnum";
import { GameStateEnum } from "../Enums/GameStateEnum";
import { gameStore } from "../stores/GameStore";
import { roundService } from "./RoundService";

interface Response {
  game_state: GameStateEnum;
  room_id: string;
  round: number;
  turn_player_id: string;
  choosing: boolean;
  player_status: number;
  me: string;
  player: Player;
  players: Player[];
}

class GameService {
  private static __instance: GameService | null;
  public static getInstance = (): GameService => {
    if (!this.__instance) this.__instance = new GameService();
    return this.__instance;
  };

  public init = (): void => {
    socketService.init();
    roundService.init();
    socketService.registerEvent(EventEnum.ROOM_SYNC, this.roomSyncServer);
  };

  public create = (player: Player) => {
    console.log(player);
    socketService.emitEvent(EventEnum.CREATE, { player });
  };

  public join = (player: Player, roomId: string) => {
    console.log(player);
    socketService.emitEvent(EventEnum.JOIN, { player, room_id: roomId });
  };

  public roomSyncServer = (res: Response) => {
    console.log(res);
    if (res.game_state) gameStore.setGameState(res.game_state);
    if (res.room_id) gameStore.setRoomId(res.room_id);
    if (res.choosing !== undefined) gameStore.setChoosing(res.choosing);
    if (res.turn_player_id) gameStore.setTurnPlayerId(res.turn_player_id);
    if (res.round) gameStore.setRound(res.round);
    if (res.player_status === 0) {
      if (res.players) res.players.map((item) => gameStore.addPlayer(item));
      if (res.player) gameStore.addPlayer(res.player);
    }
  };

  public startGameClient = () => {
    gameStore.setGameState(GameStateEnum.START);
    gameStore.setChoosing(true);
    socketService.emitEvent(GameStateEnum.START, {
      roomSettings: gameStore.settings,
    });
  };
}

export const gameService = GameService.getInstance();
