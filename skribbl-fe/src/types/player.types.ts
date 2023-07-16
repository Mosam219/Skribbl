import { RoleEnum } from "../Enums/RoleEnum";

export interface Player {
  name: string;
  id: string;
  avatar: string;
  role: RoleEnum;
}
