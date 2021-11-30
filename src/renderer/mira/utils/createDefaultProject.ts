import { Layer, Project } from "..";

export function createDefaultProject() {
  const project = new Project();
  const layer = new Layer();
  layer.name = "Background";
  layer.init();
  project.root.children.push(layer);
  project.resize();
  layer.ctx.fillStyle = "white";
  layer.ctx.fillRect(0, 0, project.width, project.height);
  return project;
}
