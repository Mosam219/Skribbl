import { Socket } from "socket.io-client";
import { gameStore } from "../stores/GameStore";
import { socketService } from "./SocketService";
import { EventEnum } from "../Enums/EventEnum";
import { chatStore } from "../stores/ChatStore";

interface RoundSyncResponse {
  game_state?: string;
  scores?: { [palyerId: string]: number };
  turn_player_id?: string;
  round?: number;
  choosing?: boolean;
  word_list?: string[];
  guessed_player_id: string;
  time_left: number;
  round_start?: boolean;
  round_change?: boolean;
  word_length?: number;
  word?: string;
}

class RoundService {
  private static _instance: RoundService;
  public static getInstance = () => {
    if (!this._instance) this._instance = new RoundService();
    return this._instance;
  };

  public init() {
    console.log("registering");
    socketService.registerEvent(EventEnum.CHAT, this.serverChat);
    socketService.registerEvent(EventEnum.ROUND_SYNC, this.roundSync);
  }
  public roundSync = (state: RoundSyncResponse) => {
    console.log(state);
    if (state.word_list) gameStore.setWordList(state.word_list);
    if (state.word) gameStore.setCurrentWord(state.word);
    if (state.choosing !== undefined) gameStore.setChoosing(state.choosing);
  };

  public wordRevealClient = (word: string) => {
    gameStore.setCurrentWord(word);
    gameStore.setChoosing(false);
    socketService.emitEvent(EventEnum.WORD_REVEAL, { word: word });
  };

  public sendChat = (msg: string) => {
    socketService.emitEvent(EventEnum.CHAT, { msg: msg });
  };

  public serverChat = (data: { message: string; userId: string }) => {
    chatStore.addMessage(data);
  };
}
export const roundService = RoundService.getInstance();
