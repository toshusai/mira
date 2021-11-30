export class Layer {
  name: string = "Layer";
  show: boolean = false;
  opacity: number = 1;
  children: Layer[] = [];
  ctx!: CanvasRenderingContext2D;
  canvas!: HTMLCanvasElement;

  init() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }
}
