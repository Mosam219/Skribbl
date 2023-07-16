import React from "react";
import { socketService } from "../services/SocketService";
import { canvasService } from "../services/CanvasService";
import { canvasStore } from "../stores/CanvasStore";

interface start {
  x: number;
  y: number;
}

interface Props {
  tool: number;
  height: number;
  width: number;
}

const Canvas = (props: Props) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [start, setStart] = React.useState<start>({} as start);
  const [isDraw, setIsDraw] = React.useState<boolean>(false);
  const startDrawing = React.useCallback(({ nativeEvent }: any) => {
    let { offsetX, offsetY } = nativeEvent;
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.TouchEvent) {
      if (nativeEvent.changedTouches?.length) {
        offsetX = nativeEvent.changedTouches[0].clientX - canvas.offsetLeft;
        offsetY = nativeEvent.changedTouches[0].clientY - canvas.offsetTop;
      }
    }
    setStart({ x: offsetX, y: offsetY });
    setIsDraw(true);
  }, []);
  const stopDrawing = () => {
    console.log("stopped drawing");
    setIsDraw(false);
  };
  const draw = React.useCallback(
    ({ nativeEvent }: any) => {
      if (!isDraw) return;
      let { offsetX, offsetY } = nativeEvent;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      if (!context) return;
      if (window.TouchEvent) {
        if (nativeEvent.changedTouches?.length) {
          offsetX = nativeEvent.changedTouches[0].clientX - canvas.offsetLeft;
          offsetY = nativeEvent.changedTouches[0].clientY - canvas.offsetTop;
        }
      }
      const currentX = offsetX;
      const currentY = offsetY;
      if (props.tool === 0)
        canvasService.draw(start.x, start.y, currentX, currentY);
      else canvasService.erase(currentX, currentY, 20);
      canvasService.serializeCanvas([start.x, start.y, currentX, currentY]);
      setStart({ x: currentX, y: currentY });
    },
    [start]
  );
  React.useEffect(() => {
    canvasService.init();

    const canvas = canvasRef.current;
    if (!canvas) return;
    canvasStore.setCanvas(canvas);
  }, []);
  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      style={{ border: "1px solid black", background: "white" }}
      {...props}
    />
  );
};
export default Canvas;
