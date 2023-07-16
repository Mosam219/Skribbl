import { MenuItem, Select } from "@mui/material";
import Players from "../../components/Players";
import { useAppContext } from "../../contexts/AppContext";
import { gameService } from "../../services/GameService";
import { roundService } from "../../services/RoundService";
import { gameStore } from "../../stores/GameStore";
import { observer } from "mobx-react";
import React from "react";

interface Props {
  urlRoomId: string;
}

const Lobby = ({ urlRoomId }: Props) => {
  const roomId = gameStore.roomId;
  const userList = gameStore.players;
  const settings = gameStore.settings;
  const URL = `http://localhost:3000/${roomId}`;

  const handleChange = (value: number, key: string) => {
    if (key === "noOfRounds") {
      gameStore.setSettings({
        noOfRounds: +value,
        roundTime: settings.roundTime,
      });
    } else {
      gameStore.setSettings({
        noOfRounds: settings.noOfRounds,
        roundTime: +value,
      });
    }
  };

  const { snack } = useAppContext();
  const handleCopyLink = () => {
    snack.show("Link Copied", "success");
    navigator.clipboard.writeText(URL);
  };
  const handleStart = () => {
    gameService.startGameClient();
  };
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-1/3 h-4/6 min-h-0">
        <div className="w-full bg-slate-100 text-center mb-5 text-slate-800 border-2 rounded-md border-slate-200">
          <div className="my-2">Link to join this Room</div>
          <div className="flex justify-center items-center mb-3">
            <div className="bg-white h-7 border-slate-200 border-2 rounded-md px-1">
              {URL}
            </div>
            <button
              className="ml-4 rounded-md bg-blue-300 text-slate-600 p-1"
              onClick={() => handleCopyLink()}
            >
              Copy Link
            </button>
          </div>
        </div>
        <div className="flex justify-between h-4/6 min-h-min bg-slate-300 border-2 rounded-md border-slate-400">
          <div className=" w-1/2 flex-col justify-center">
            <div className="text-center text-2xl font-bold text-slate-500 underline">
              Players
            </div>
            <div className="h-5/6 overflow-auto">
              <Players players={userList} />
            </div>
          </div>
          <div className="w-1/2 flex flex-col justify-around">
            {!urlRoomId && (
              <div>
                <div className="flex justify-around items-center">
                  <span>No of Rounds:</span>
                  <Select
                    className="h-8"
                    value={settings.noOfRounds}
                    onChange={(e) =>
                      handleChange(e.target.value as number, "noOfRounds")
                    }
                  >
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                  </Select>
                </div>
                <div className="flex justify-around items-center mt-4">
                  <span>Time for each Round</span>
                  <Select
                    className="h-8"
                    value={settings.roundTime}
                    onChange={(e) =>
                      handleChange(e.target.value as number, "roundTime")
                    }
                  >
                    <MenuItem value={30}>30 sec</MenuItem>
                    <MenuItem value={40}>40 sec</MenuItem>
                    <MenuItem value={60}>60 sec</MenuItem>
                  </Select>
                </div>
              </div>
            )}
            {!urlRoomId && (
              <div className="flex justify-center">
                <button
                  className="bg-slate-500 rounded-sm text-white py-1 px-2 rounded-full"
                  onClick={() => handleStart()}
                >
                  {"Start Game"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default observer(Lobby);
