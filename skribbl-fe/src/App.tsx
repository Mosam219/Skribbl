import EntryScreen from "./pages/EntryScreen";
import { gameStore } from "./stores/GameStore";
import { GameStateEnum } from "./Enums/GameStateEnum";
import Lobby from "./pages/Lobby";
import { observer } from "mobx-react";
import React from "react";
import Game from "./pages/Game";
import { AppProvider } from "./contexts/AppContext";
function App() {
  const { gameState } = gameStore;
  const [roomId, setRoomId] = React.useState<string>("");
  React.useEffect(() => {
    setRoomId(window.location.pathname.substring(1));
  }, []);
  console.log(gameState);
  return (
    <AppProvider>
      {gameState === GameStateEnum.NONE ? (
        <EntryScreen roomId={roomId} />
      ) : gameState === GameStateEnum.LOBBY ? (
        <Lobby urlRoomId={roomId} />
      ) : (
        <Game />
      )}
    </AppProvider>
  );
}

export default observer(App);
