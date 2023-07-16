import { Icon, Tooltip } from "@mui/material";
import { Player } from "../types/player.types";
import { RoleEnum } from "../Enums/RoleEnum";

interface Props {
  players: Player[];
}
const Players = ({ players }: Props) => {
  return (
    <>
      {players.map(
        (item, index) =>
          item.name && (
            <div key={index} className="flex m-4 items-center relative">
              {item.role === RoleEnum.CREATOR && (
                <div className="absolute -left-2 -top-2">
                  <Tooltip title="Creator of Room" placement="left">
                    <Icon className="ri-star-fill text-base text-yellow-300" />
                  </Tooltip>
                </div>
              )}
              <img
                alt="profile Pic"
                className="w-14 h-14 bg-slate-50 mr-10 rounded-md"
                src={item.avatar}
              />
              <span className="text-slate-600 text-md font-bold">
                {item.name}
              </span>
            </div>
          )
      )}
    </>
  );
};

export default Players;
