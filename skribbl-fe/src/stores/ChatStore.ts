import { action, computed, observable } from "mobx";
import { Chat } from "../types/chat.types";

class ChatStore {
  private static __instance: ChatStore | null;
  public static getInstance = (): ChatStore => {
    if (!this.__instance) this.__instance = new ChatStore();
    return this.__instance;
  };

  private constructor() {
    this._msg = [];
  }

  @observable
  private _msg: Chat[];

  @computed
  public get chats(): Chat[] {
    return this._msg;
  }

  @action
  public addMessage = ({ message, userId }: Chat) => {
    this._msg.push({ message, userId });
  };
}

export const chatStore = ChatStore.getInstance();
