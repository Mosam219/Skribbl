import { Socket } from "socket.io";
import { socketService } from "../services/SocketService";
import { EventEnum } from "../Enums/eventEnum";
import { PlayerDTO } from "../DTOs/playerDTO";
import { gameService } from "../services/GameService";
import { GameStateEnum } from "../Enums/gameStateEnum";
import { RoomSettings } from "../types/gameService.types";
import { roundService } from "../services/RoundService";

const drawMessage = (socket: Socket) => {
  socket.on(
    "draw",
    ({ batches, drawer }: { batches: any; drawer: boolean }) => {
      drawer &&
        socketService.sendToAll(socket, "draw", {
          batches,
          drawer,
        });
    }
  );
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
  console.log("setting");
  socket.on(EventEnum.WORD_REVEAL, ({ word }: { word: string }) => {
    console.log("word", word);
    roundService.wordReveal(socket, word);
  });
};

const gameRoundSyncHandler = (socket: Socket) => {
  socket.on(EventEnum.ROUND_SYNC, (data: { chosen_word?: string }) => {
    roundService.roundSync(socket, data.chosen_word);
  });
};

const gameChatHandler = (socket: Socket) => {
  socket.on(EventEnum.CHAT, (data: { msg: string }) => {
    console.log(data.msg);
    roundService.gameChat(socket, data.msg);
  });
};

export const GameHandlers = {
  drawMessage,
  createGame,
  joinGame,
  startGame,
  wordReveal,
  gameRoundSyncHandler,
  gameChatHandler,
};
