import { Project } from "../Project";

export function makeResultCanvas(project: Project) {
  const canvas = document.createElement("canvas");
  canvas.width = project.width;
  canvas.height = project.height;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, project.width, project.height);
  project.root.children.forEach((l) => {
    ctx.globalAlpha = l.opacity;
    ctx.drawImage(l.canvas, 0, 0);
  });
  return canvas;
}
