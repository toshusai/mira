<template>
  <div v-if="project" class="editor">
    <!-- Top Tool Bar -->
    <sp-split-view :vertical="true">
      <app-header :projectSync.sync="project" />
      <sp-split-view-splitter />
      <app-action-bar :flipHSync.sync="flipH" />
      <sp-split-view-splitter />
    </sp-split-view>

    <sp-split-view style="height: calc(100vh - 68px)">
      <side-tool-bar
        :projectSync.sync="project"
        :toolSync.sync="tool"
        :pencilSync.sync="pencil"
        :eraserSync.sync="eraser"
      />

      <sp-split-view-splitter style="min-width: 2px" />

      <sp-split-view-pane
        style="overflow: hidden; width: 10000px; height: 100%"
      >
        <mira-canvas
          ref="canvas"
          :pencil="pencil"
          :tool="tool"
          :eraser="eraser"
          :currentLayer="selectedLayer"
          :flipH="flipH"
          :layers="project.root.children"
          :project="project"
        ></mira-canvas>
      </sp-split-view-pane>

      <sp-split-view-splitter style="min-width: 2px" />
      <layer-panel
        :projectSync.sync="project"
        :selectedLayerS.sync="selectedLayer"
        :treeWidth="treeWidth"
        @update="update"
      />
    </sp-split-view>
  </div>
</template>

<style >
.editor {
  height: 100vh;
  max-height: -webkit-fill-available;
  min-width: 100vw;
  overflow: hidden;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Ref } from "vue-property-decorator";
// @ts-ignore
import loadicons from "loadicons";
// import { TreeItem } from "spec-ui";
import MiraCanvas from "../components/MiraCanvas.vue";
import AppHeader from "../components/AppHeader.vue";
import AppActionBar from "../components/AppActionBar.vue";
import LayerPanel from "../components/LayerPanel.vue";
import SideToolBar from "../components/SideToolBar.vue";
import { findTagInParent } from "../utils/dom";
import { Eraser, Layer, Pencil, Project, Tool } from "~/mira";
import { createDefaultProject } from "~/mira/utils";
import { UndoManager } from "~/mira/UndoManager";

@Component({
  components: {
    MiraCanvas,
    AppHeader,
    AppActionBar,
    LayerPanel,
    SideToolBar,
  },
})
export default class IndexPage extends Vue {
  project: Project = new Project();
  tool: Tool = Tool.Pencil;
  Tool = Tool;
  treeWidth: number = 200;
  selectedLayer: Layer | null = null;
  pencil: Pencil = new Pencil();
  eraser: Eraser = new Eraser();
  flipH: boolean = false;

  @Ref() canvas!: MiraCanvas;

  clear() {
    this.canvas.clear();
  }

  changeW(x: number) {
    this.treeWidth -= x;
  }

  update() {
    this.canvas.renderCanvas();
  }

  mounted() {
    loadicons("/mira/static/spectrum-css-icons.svg", () => {});
    loadicons("/mira/static/spectrum-icons.svg", () => {});
    this.project = createDefaultProject();
    this.selectedLayer = this.project.root.children[0];

    // Avoid page scroll with stylus, but enable button click.
    document.body.addEventListener(
      "touchmove",
      (e) => {
        if (!findTagInParent(e.target as HTMLElement, "BUTTON")) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
  }
}
</script>
