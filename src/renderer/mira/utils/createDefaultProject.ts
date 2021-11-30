import { Layer, Project } from "..";

export function createDefaultProject() {
  const project = new Project();
  const layer = new Layer();
  layer.name = "Background";
  project.root.children.push(layer);
  layer.init(project.width, project.height);
  const layer2 = new Layer();
  layer2.name = "Layer 1";
  layer2.init(project.width, project.height);

  project.root.children.push(layer2);
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
