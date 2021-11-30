export class Layer {
  name: string = "Layer";
  show: boolean = false;
  opacity: number = 1;
  children: Layer[] = [];
  ctx!: CanvasRenderingContext2D;
  canvas!: HTMLCanvasElement;

  lastImageData!: ImageData;

  init(width?: number, height?: number) {
    this.canvas = document.createElement("canvas");
    if (width) this.canvas.width = width;
    if (height) this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.ctx.clearRect(
      0,
      0,
      width ?? this.canvas.width,
      height ?? this.canvas.height
    );
    this.lastImageData = this.ctx.getImageData(
      0,
      0,
      width ?? this.canvas.width,
      height ?? this.canvas.height
    );
  }
}
