import { Vector3 } from "~/mira/math/Vector3";

export function getXY(
  element: HTMLElement,
  scale: number,
  event: MouseEvent | TouchEvent
): Vector3 {
  const rect = element.getBoundingClientRect();
  const left = rect.left;
  const top = rect.top;
  let x, y, z;
  if (
    event instanceof TouchEvent &&
    event.touches &&
    event.touches[0] &&
    typeof event.touches[0].force !== "undefined"
  ) {
    // @ts-ignore
    if (event.touches[0].touchType != "stylus") return { x, y, z };
    if (event.touches[0].force > 0) {
      z = event.touches[0].force;
    }
    x = (event.touches[0].pageX - left) / scale;
    y = (event.touches[0].pageY - top) / scale;
  } else if (event instanceof MouseEvent) {
    z = 1.0;
    x = (event.pageX - left) / scale;
    y = (event.pageY - top) / scale;
  }
  return new Vector3(x, y, z);
}
