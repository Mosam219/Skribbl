import { Socket } from "socket.io";
import { Helper } from "../utils/helper";
import Room from "../models/Room";
import { PlayerDTO } from "../DTOs/playerDTO";
import { socketService } from "./SocketService";
import { EventEnum } from "../Enums/eventEnum";
import { GameStateEnum } from "../Enums/gameStateEnum";
import { mapService } from "./MapService";
import Player from "../models/Player";
import { gameHelperService } from "./GameServiceHelper";
import { RoomSettings } from "../types/gameService.types";

class GameService {
  private static __instance: GameService | null;
  public static getInstance(): GameService {
    if (!this.__instance) this.__instance = new GameService();
    return this.__instance;
  }

  public createGame = (socket: Socket, payload: PlayerDTO) => {
    const roomId = Helper.generateRandomString(8, {
      includeLowerCase: true,
      includeUpperCase: true,
      includeNumbers: false,
    });
    console.log("payload", payload);
    const room = new Room(roomId);
    const player = room.addPlayer(socket, {
      id: socket.id,
      name: payload.name,
      avatar: payload.avatar,
      role: payload.role,
    });
    socketService.sendPrivate(socket, EventEnum.ROOM_SYNC, {
      player: player.getJson(),
      room_id: player.getRoomId(),
      game_state: GameStateEnum.LOBBY,
      player_status: 0,
      me: player.id,
      players: room.getPlayers(),
    });
  };

  public joinGame = (socket: Socket, payload: PlayerDTO, room_id: string) => {
    const room = mapService.get<Room>(room_id);
    if (!room) {
      socketService.sendPrivate(socket, EventEnum.ERROR, {
        error: "Invalid Room Id",
      });
      return;
    }
    const player = room.addPlayer(socket, {
      id: socket.id,
      name: payload.name,
      avatar: payload.avatar,
      role: payload.role,
    });
    const playersId = room.getPlayers();
    const players = playersId.map((id) => {
      const player = mapService.getEntity<Player>(id);
      return player?.getJson();
    });

    socketService.sendPrivate(socket, EventEnum.ROOM_SYNC, {
      room_id: player.getRoomId(),
      me: player.id,
      player_status: 0,
      game_state: GameStateEnum.LOBBY,
      players,
    });

    socketService.sendToRoom(socket, EventEnum.ROOM_SYNC, room_id, {
      player: player.getJson(),
      player_status: 0,
    });
  };

  public startGame = (socket: Socket, settings: RoomSettings) => {
    const roomAndPlayer = gameHelperService.getPlayerAndRoom(socket);
    console.log(roomAndPlayer);
    if (!roomAndPlayer) {
      console.log("player Or Room not found");
      return;
    }
    const { room, player } = roomAndPlayer;
    console.log(player, room);

    // updating settings for game
    room.setSettings(settings);

    const playerIds = room.getPlayers();
    const drawPlayerId = Helper.getRandom<string>(playerIds);
    const drawer = mapService.getEntity<Player>(drawPlayerId);
    console.log("drawer", drawer);
    if (!drawer) return;

    room.setCurrentPlayerIndex(room.getPlayers().indexOf(drawer.id));
    room.resetScore();
    room.setGameStarted(true);

    socketService.sendToRoom(socket, EventEnum.ROOM_SYNC, room.id, {
      game_state: GameStateEnum.START,
      scores: room.scores,
      turn_player_id: drawer.id,
      round: room.currentRound,
      choosing: true,
    });

    socketService.sendPrivate(drawer.mySocket, EventEnum.ROUND_SYNC, {
      word_list: gameHelperService.getRandomWords(),
    });
  };
}
export const gameService = GameService.getInstance();
