import { Socket } from "socket.io";
import { PlayerDTO } from "../DTOs/playerDTO";
import BaseSchema from "./_base";
import moment from "moment";
import Player from "./Player";
import { mapService } from "../services/MapService";
import { RoomSettings } from "../types/gameService.types";

class Room extends BaseSchema {
  private _players: string[];
  private _currentRound: number;
  private _roundStartTime: number;
  private _currentPlayerIndex: number;
  private _scores: { [key: string]: number };
  private _currentWord: string;
  private _guessedPlayer: string[];
  private _gameStarted: boolean;
  private _settings: RoomSettings;
  private _chanceCount: number;

  public constructor(id: string) {
    super(id);
    this._players = [];
    this._currentRound = 1;
    this._roundStartTime = moment.now();
    this._scores = {};
    this._currentWord = "";
    this._currentPlayerIndex = 0;
    this._guessedPlayer = [];
    this._gameStarted = false;
    this._chanceCount = 1;
    this._settings = { noOfRounds: 2, roundTime: 30 };
    this._updateCache();
  }

  private _updateCache() {
    mapService.setEntity<Room>(this.id, this);
  }

  public setSettings = (settings: RoomSettings) => {
    this._settings = settings;
    this._updateCache();
  };

  public setCurrentPlayerIndex = (idx: number) => {
    this._currentPlayerIndex = idx;
    this._updateCache();
  };

  public get scores() {
    return this._scores;
  }

  public get currentRound() {
    return this._currentRound;
  }

  public resetScore = () => {
    this._scores = {};
    this._updateCache();
  };

  public setDrawer = (idx: number) => {
    this._currentPlayerIndex = idx;
    this._updateCache();
  };

  public addPlayer = (socket: Socket, playerInfo: PlayerDTO): Player => {
    const player = new Player(
      socket,
      playerInfo.name,
      playerInfo.avatar,
      playerInfo.role,
      this.id
    );
    this._players.push(player.id);
    player.joinRoom(this.id);
    this._updateCache();
    return player;
  };

  public setGameStarted(start: boolean) {
    this._gameStarted = start;
    this._updateCache();
  }

  public get gameStarted(): boolean {
    return this._gameStarted;
  }

  public getPlayers = () => this._players;

  public get currentWord(): string {
    return this._currentWord;
  }

  public setCurrentWord(word: string): void {
    this._currentWord = word;
    this._updateCache();
  }
}
export default Room;
