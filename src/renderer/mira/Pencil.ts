import { Color } from "@toshusai/spectrum-vue";
import { IPencil } from "./IPencil";

export class Pencil implements IPencil {
  size: number = 10;
  opacity: number = 1;
  pressureSizeWeight: number = 1;
  pressureOpacityWeight: number = 1;
  color: Color = new Color();

  clone() {
    const pencil = new Pencil();
    pencil.size = this.size;
    pencil.opacity = this.opacity;
    pencil.pressureSizeWeight = this.pressureSizeWeight;
    pencil.pressureOpacityWeight = this.pressureOpacityWeight;
    pencil.color = new Color();
    pencil.color.r = this.color.r;
    pencil.color.g = this.color.g;
    pencil.color.b = this.color.b;
    return pencil;
  }
}
