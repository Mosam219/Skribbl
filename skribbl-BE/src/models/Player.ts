import { Socket } from "socket.io";
import BaseSchema from "./_base";
import { mapService } from "../services/MapService";

class Player extends BaseSchema {
  private _roomId: string = "";
  private _name: string = "";
  private _avatar: string = "";
  private _role: string = "";
  private _socket: Socket;
  public constructor(
    _socket: Socket,
    _name: string,
    _avatar: string,
    _role: string,
    _roomId: string
  ) {
    super(_socket.id);
    this._socket = _socket;
    this._avatar = _avatar;
    this._name = _name;
    this._role = _role;
    this._roomId = _roomId;
    mapService.setEntity<Player>(this.id, this);
  }

  public get mySocket(): Socket {
    return this._socket;
  }

  public joinRoom = (roomId: string) => {
    this._socket?.join(roomId);
  };

  public getRoomId = (): string => {
    return this._roomId;
  };
  public getName = (): string => {
    return this._name;
  };
  public getAvatar = (): string => {
    return this._avatar;
  };
  public getRole = (): string => {
    return this._role;
  };
  public getJson = () => {
    return {
      avatar: this._avatar,
      name: this._name,
      role: this._role,
      id: this.id,
    };
  };
}
export default Player;
