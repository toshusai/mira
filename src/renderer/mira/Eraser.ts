import { IPencil } from "./IPencil";

export class Eraser implements IPencil {
  size: number = 10;
  opacity: number = 1;
  pressureSizeWeight: number = 1;
  pressureOpacityWeight: number = 1;

  clone() {
    const pencil = new Eraser();
    pencil.size = this.size;
    pencil.opacity = this.opacity;
    pencil.pressureSizeWeight = this.pressureSizeWeight;
    pencil.pressureOpacityWeight = this.pressureOpacityWeight;
    return pencil;
  }
}
