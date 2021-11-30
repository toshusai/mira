import { readPsd } from "ag-psd";
import { Layer } from "../Layer";
import { Project } from "../Project";

export async function fileToProject(file: File): Promise<Project> {
  const project = new Project();
  project.name = file.name.replace(/\.psd$/, "");
  const psd = readPsd(await file.arrayBuffer());
  psd.imageResources = {};

  psd.children?.forEach((c) => {
    if (c.canvas) {
      const layer = new Layer();
      layer.name = c.name || "";
      layer.canvas = c.canvas;
      layer.ctx = c.canvas.getContext("2d") as CanvasRenderingContext2D;
      project.root.children.push(layer);
    }
  });
  return project;
}
