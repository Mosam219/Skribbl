import { socketService } from "./SocketService";
import { canvasStore } from "../stores/CanvasStore";
import { gameStore } from "../stores/GameStore";

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
    socketService.registerEvent(
      "draw",
      ({
        batches,
        drawer,
      }: {
        batches: Array<Array<number>>;
        drawer: boolean;
      }) => {
        console.log(batches, drawer);
        batches.map((item) =>
          this.draw(item[0], item[1], item[2], item[3], item[4], drawer)
        );
      }
    );
  }
  public draw(
    startX: number,
    startY: number,
    currX: number,
    currY: number,
    type: number,
    server: boolean = false
  ): void {
    if (!server && !gameStore.drawAccess) return;
    const canvas = canvasStore?.Canvas;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(currX, currY);
    console.log(type);
    if (type === 2) {
      ctx.fillStyle = "black";
    } else ctx.fillStyle = "white";
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
        socketService.emitEvent("draw", {
          batches: this.batches,
          drawer: gameStore.drawAccess,
        });
        this.requestedTime = false;
        this.batches = [];
      }, this.TIME_DELAY);
    }
    this.requestedTime = true;
  }
}
export const canvasService = CanvasService.getInstance();
