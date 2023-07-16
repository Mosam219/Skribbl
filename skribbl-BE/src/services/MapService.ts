import BaseSchema from "../models/_base";
import * as _ from "lodash";

class MapService {
  private static __instance: MapService | null;
  private map: { [key: string]: any } = {};

  public static getInstance = (): MapService => {
    if (!this.__instance) this.__instance = new MapService();
    return this.__instance;
  };

  public setEntity = <T extends BaseSchema>(id: string, obj: T): void => {
    this.map[id] = obj;
  };

  public getEntity = <T extends BaseSchema>(id: string): T | undefined => {
    return this.map[id];
  };

  public remove(id: string) {
    this.map = _.omit(this.map, id);
  }

  public add<T = any>(id: string, data: T): void {
    this.map[id] = data;
  }

  public get<T = any>(id: string): T | undefined {
    return this.map[id] as T | undefined;
  }
}

export const mapService = MapService.getInstance();
