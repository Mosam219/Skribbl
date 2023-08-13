import React from "react";
import { gameStore } from "../stores/GameStore";
import { chatStore } from "../stores/ChatStore";
import { observer } from "mobx-react";
import { roundService } from "../services/RoundService";

const ChatArea = () => {
  const [message, setMessage] = React.useState<string>("");
  const { chats } = chatStore;

  const handleSend = () => {
    if (!message) return;
    chatStore.addMessage({
      message: message || "",
      userId: gameStore.getMe || "",
    });
    roundService.sendChat(message);
    setMessage("");
  };

  return (
    <div className="h-[95%] bg-red-50 relative">
      <div className="h-[93%] bg-slate-100">
        {chats.map((item) => (
          <div className="w-full flex gap-2">
            <div className="font-bold text-green-400 max-w-[90px] overflow-hidden">
              {gameStore.getPlayerById(item.userId)?.name}
            </div>
            <div>{item.message || ""}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-around absolute bottom-0 w-full">
        <input
          placeholder="Type here.."
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          className="border-2 rounded-sm focus:outline-none p-1 w-[80%]"
        />
        <button
          onClick={() => handleSend()}
          className="bg-slate-500 rounded-sm w-[20%] text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default observer(ChatArea);
