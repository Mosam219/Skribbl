import React, { ReactNode } from "react";
import Canvas from "../../components/Canvas";
import { Player } from "../../types/player.types";
import { ACTIONS_BTN, INITIAL_USER_INFO_STATE } from "./constants";
import { canvasStore } from "../../stores/CanvasStore";
import { RoleEnum } from "../../Enums/RoleEnum";
import { gameService } from "../../services/GameService";
import { canvasService } from "../../services/CanvasService";
import { useAppContext } from "../../contexts/AppContext";

const EntryScreen = ({ roomId }: { roomId: string }) => {
  const [userData, setUserData] = React.useState<Player>(
    INITIAL_USER_INFO_STATE
  );
  const [tool, setTool] = React.useState<number>(0);
  const { snack } = useAppContext();
  const handleToolChange = (value: number) => {
    if (value === 2) {
      canvasService.clearCanvas();
      setTool(0);
    } else setTool(value);
  };
  const handleInfoChange = (key: string, value: string) => {
    setUserData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const handleSubmit = () => {
    if (!userData.name) {
      snack.show("Please fill your name", "error");
      return;
    }
    gameService.init();
    const canvas = canvasStore.Canvas;
    const avatarURL = canvas?.toDataURL();
    if (roomId) {
      gameService.join(
        {
          ...userData,
          avatar: avatarURL || "",
          role: RoleEnum.JOINER,
        },
        roomId
      );
    } else {
      gameService.create({
        ...userData,
        avatar: avatarURL || "",
        role: RoleEnum.CREATOR,
      });
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="h-1/2 bg-slate-100 border-slate-400 border-2 rounded-md">
        <div className="flex justify-center mt-3 font-bold text-slate-600 text-3xl">
          Skribble
        </div>
        <div className="flex p-8 justify-between">
          <div>
            <Canvas height={200} width={200} tool={tool} />
            <div className="flex justify-around w-full">
              {Object.values(ACTIONS_BTN).map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleToolChange(index)}
                  className="font-bold underline cursor-pointer text-slate-600"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-between ml-8">
            <input
              placeholder="Name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={userData.name}
              onChange={(e) => handleInfoChange("name", e.target.value)}
            />
            <button
              className="bg-slate-500 text-white rounded-lg"
              onClick={() => handleSubmit()}
            >
              {roomId ? "Join Room" : "Create Room"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EntryScreen;
