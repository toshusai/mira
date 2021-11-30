import { Vector2 } from "./Vector2";

export function getDistance(a: Vector2, b: Vector2) {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

export function getAngle(a: Vector2, b: Vector2) {
  return Math.atan2(b.x - a.x, b.y - a.y);
}
