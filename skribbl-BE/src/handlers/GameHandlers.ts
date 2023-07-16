import { Socket } from "socket.io";
import { socketService } from "../services/SocketService";
import { EventEnum } from "../Enums/eventEnum";
import { PlayerDTO } from "../DTOs/playerDTO";
import { gameService } from "../services/GameService";
import { GameStateEnum } from "../Enums/gameStateEnum";
import { RoomSettings } from "../types/gameService.types";
import { roundService } from "../services/RoundService";

const drawMessage = (socket: Socket) => {
  socket.on("draw", (value: any) => {
    socketService.sendToAll(socket, "draw", value);
  });
};

const createGame = (socket: Socket) => {
  socket.on(EventEnum.CREATE, ({ player }: { player: PlayerDTO }) => {
    gameService.createGame(socket, player);
  });
};

const joinGame = (socket: Socket) => {
  socket.on(
    EventEnum.JOIN,
    ({ player, room_id }: { player: PlayerDTO; room_id: string }) => {
      gameService.joinGame(socket, player, room_id);
    }
  );
};

const startGame = (socket: Socket) => {
  socket.on(GameStateEnum.START, (settings: RoomSettings) => {
    gameService.startGame(socket, settings);
  });
};

const wordReveal = (socket: Socket) => {
  socket.on(EventEnum.WORD_REVEAL, () => {
    roundService.wordReveal(socket);
  });
};

const gameRoundSyncHandler = (socket: Socket) => {
  socket.on(EventEnum.ROUND_SYNC, (data: { chosen_word?: string }) => {
    roundService.roundSync(socket, data.chosen_word);
  });
};

export const GameHandlers = {
  drawMessage,
  createGame,
  joinGame,
  startGame,
  wordReveal,
  gameRoundSyncHandler,
};
