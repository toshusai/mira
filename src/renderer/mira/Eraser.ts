import { IPencil } from "./IPencil";

export class Eraser implements IPencil {
  size: number = 10;
  opacity: number = 1;
  pressureSizeWeight: number = 1;
  pressureOpacityWeight: number = 1;
}
