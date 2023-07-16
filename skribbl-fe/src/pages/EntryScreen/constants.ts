import { RoleEnum } from "../../Enums/RoleEnum";
import { Player } from "../../types/player.types";

export const INITIAL_USER_INFO_STATE: Player = {
  avatar: "",
  id: "",
  name: "",
  role: RoleEnum.JOINER,
};

export const ACTIONS_BTN = {
  PENCIL: "Pencil",
  ERASER: "Eraser",
  CLEAR: "Clear",
};
