export interface IVector3 {
  x: number;
  y: number;
  z: number;
}

export class Vector3 implements IVector3 {
  x: number;
  y: number;
  z: number;
  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
