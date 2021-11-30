import { Color } from "@toshusai/spectrum-vue";
import { IPencil } from "./IPencil";

export class Pencil implements IPencil {
  size: number = 10;
  opacity: number = 1;
  pressureSizeWeight: number = 1;
  pressureOpacityWeight: number = 1;
  color: Color = new Color();
}
