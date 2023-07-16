import { socketService } from "./SocketService";
import { canvasStore } from "../stores/CanvasStore";

class CanvasService {
  private static __instance: CanvasService | null;
  private batches: Array<Array<number>>;
  private requestedTime: boolean;
  private TIME_DELAY = 50;

  private constructor() {
    this.batches = [];
    this.requestedTime = false;
  }
  public static getInstance(): CanvasService {
    if (!this.__instance) this.__instance = new CanvasService();
    return this.__instance;
  }
  public init(): void {
    console.log("initiated canvas service");
    socketService.registerEvent("draw", (value: Array<Array<number>>) => {
      console.log(value);
      value.map((item) => this.draw(item[0], item[1], item[2], item[3]));
    });
  }
  public draw(
    startX: number,
    startY: number,
    currX: number,
    currY: number
  ): void {
    console.log("hey");
    const canvas = canvasStore?.Canvas;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(currX, currY);
    ctx.fillStyle = "black";
    ctx.stroke();
  }
  public erase(currX: number, currY: number, size: number = 20): void {
    const canvas = canvasStore?.Canvas;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "white";
    ctx.fillRect(currX, currY, size, size);
  }
  public clearCanvas = (): void => {
    const canvas = canvasStore?.Canvas;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
  };
  public serializeCanvas(command: Array<number>): void {
    this.batches.push(command);
    if (!this.requestedTime) {
      setTimeout(() => {
        socketService.emitEvent("draw", this.batches);
        this.requestedTime = false;
        this.batches = [];
      }, this.TIME_DELAY);
    }
    this.requestedTime = true;
  }
}
export const canvasService = CanvasService.getInstance();
