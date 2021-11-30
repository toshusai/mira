export interface IVector2 {
  x: number;
  y: number;
}

export class Vector2 implements IVector2 {
  x: number;
  y: number;
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
}
