import { action, computed, observable, makeObservable } from "mobx";
import { GameStateEnum } from "../Enums/GameStateEnum";
import { Player } from "../types/player.types";
import { RoomSetting } from "../types/settings.types";

class GameStore {
  private static __instance: GameStore | null;
  public static getInstance = (): GameStore => {
    if (!this.__instance) this.__instance = new GameStore();
    return this.__instance;
  };

  private constructor() {
    this._gameState = GameStateEnum.NONE;
    this._roomId = "";
    this._wordList = [];
    this._turnPlayerId = "";
    this._round = 0;
    this._currentWord = "";
    this._choosing = false;
    this._settings = {
      noOfRounds: 2,
      roundTime: 30,
    };
    makeObservable(this);
  }

  @observable
  private _gameState: GameStateEnum;

  @observable
  private _currentWord: string;

  @observable
  private _turnPlayerId: string;

  @observable
  private _round: number;

  @observable
  private _choosing: boolean;

  @observable
  private _roomId: string;

  @observable
  private _wordList: string[];

  @observable
  private _players: { [key: string]: Player } = {};

  @observable
  private _settings: RoomSetting;

  @computed
  public get settings(): RoomSetting {
    return this._settings;
  }

  @computed
  public get turnPlayerId(): string {
    return this._turnPlayerId;
  }

  @computed
  public get round(): number {
    return this._round;
  }

  @computed
  public get players(): Player[] {
    const players = Object.values(this._players);
    return players;
  }

  public getPlayerById(id: string): Player {
    return this._players[id];
  }

  @computed
  public get choosing(): boolean {
    return this._choosing;
  }

  @computed
  public get roomId(): string {
    return this._roomId;
  }

  @computed
  public get currentWord(): string {
    return this._currentWord;
  }

  @computed
  public get wordList(): string[] {
    return this._wordList;
  }

  @action
  public setSettings = (settings: RoomSetting) => {
    this._settings = settings;
  };

  @action
  public setTurnPlayerId = (id: string) => {
    this._turnPlayerId = id;
  };
  @action
  public setRound = (round: number) => {
    this._round = round;
  };

  @action
  public setWordList = (words: string[]) => {
    this._choosing = true;
    this._wordList = words;
  };

  @action
  public setChoosing = (choosing: boolean) => {
    this._choosing = choosing;
  };

  @action
  public setCurrentWord = (word: string) => {
    this._currentWord = word;
  };

  @action
  public setRoomId = (roomId: string) => {
    this._roomId = roomId;
  };

  @action
  public setGameState = (gameState: GameStateEnum) => {
    console.log(gameState);
    this._gameState = gameState;
    console.log(this._gameState);
  };

  @computed
  public get gameState(): GameStateEnum {
    return this._gameState;
  }

  @action
  public addPlayer = (player: Player) => {
    this._players[player.id] = player;
  };
}
export const gameStore = GameStore.getInstance();
