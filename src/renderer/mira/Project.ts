import { Layer } from "./Layer";

export class Project {
  name: string = "untitled";
  root: {
    children: Layer[];
  } = {
    children: [],
  };

  width: number = 512;
  height: number = 512;

  resize() {
    this.root.children.forEach((l) => {
      const x = l.ctx.getImageData(0, 0, this.width, this.height);
      l.canvas.width = this.width;
      l.canvas.height = this.height;
      l.ctx.putImageData(x, 0, 0);
    });
  }
}
