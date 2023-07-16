import { observer } from "mobx-react";
import { gameStore } from "../../stores/GameStore";
import Players from "../../components/Players";
import Canvas from "../../components/Canvas";
import React from "react";
import { canvasService } from "../../services/CanvasService";
import { ACTIONS_BTN } from "../EntryScreen/constants";
import { roundService } from "../../services/RoundService";

const Game = () => {
  const [tool, setTool] = React.useState<number>(0);
  const userList = gameStore.players;
  const wordList = gameStore.wordList;
  const choosing = gameStore.choosing;
  const drawerId = gameStore.turnPlayerId;
  const drawer = gameStore.getPlayerById(drawerId);

  console.log(choosing);

  const handleToolChange = (value: number) => {
    if (value === 2) {
      canvasService.clearCanvas();
      setTool(0);
    } else setTool(value);
  };

  const setWord = (item: string) => {
    gameStore.setCurrentWord(item);
    gameStore.setChoosing(false);
  };
  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="h-5/6 min-h-min flex justify-between w-5/6 min-w-[495px] text-slate-800 border-2 rounded-sm border-slate-400">
        <div className="bg-slate-300 w-1/5 overflow-auto flex-col justify-center">
          <div className="text-center font-bold text-slate-500">Players</div>
          <Players players={userList} />
        </div>
        <div className="w-3/5 bg-slate-200 flex items-center justify-center">
          {choosing && wordList.length ? (
            <div className="text-center w-full">
              <div className="font-bold text-slate-500 text-lg">
                Choose Word
              </div>
              <div className="flex justify-around mt-4">
                {wordList.map((item, index) => (
                  <span
                    key={index}
                    className="bg-slate-200 px-4 py-1 border-solid rounded-md cursor-pointer"
                    onClick={() => setWord(item)}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ) : choosing ? (
            <div>
              <span className="bold">{drawer ? drawer.name : ""}</span> is
              Choosing Word
            </div>
          ) : (
            <div>
              <Canvas height={300} width={300} tool={tool} />
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
          )}
        </div>
        <div className="bg-slate-300 w-1/5 overflow-auto flex-col justify-center">
          <div className="text-center font-bold text-slate-500">Players</div>
          <Players players={userList} />
        </div>
      </div>
    </div>
  );
};
export default observer(Game);
