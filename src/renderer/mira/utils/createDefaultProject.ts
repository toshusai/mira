import { Layer, Project } from "..";

export function createDefaultProject() {
  const project = new Project();
  const layer = new Layer();
  layer.name = "Background";
  project.root.children.push(layer);
  layer.init();
  project.resize();
  layer.ctx.fillStyle = "white";
  layer.ctx.fillRect(0, 0, project.width, project.height);
  layer.lastImageData = layer.ctx.getImageData(
    0,
    0,
    project.width,
    project.height
  );
  return project;
}
