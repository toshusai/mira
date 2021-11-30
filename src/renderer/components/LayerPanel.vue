<template>
  <sp-split-view-pane
    class="prevent-touchmove"
    :style="`width: ${treeWidth}px; min-width: ${treeWidth}px; max-width: ${treeWidth}px`"
  >
    <sp-action-group :compact="true" :quiet="true">
      <sp-action-button :item="true" :quiet="true" @click="addLayer">
        <sp-icon name="Add"></sp-icon>
      </sp-action-button>
      <sp-action-button :item="true" :quiet="true" @click="deleteLayer">
        <sp-icon name="Delete"></sp-icon>
      </sp-action-button>
    </sp-action-group>
    <sp-divider style="margin: 0" />
    <template v-if="selectedLayer">
      <sp-textfield
        v-model="selectedLayer.name"
        size="S"
        style="width: calc(100% - 8px); margin: 4px"
      />
      <sp-slider
        v-model="selectedLayer.opacity"
        style="margin: 0 8px"
        :min="0"
        :max="1"
        label="Opacity"
        :valueText="selectedLayer.opacity.toFixed(2)"
        @input="updateEmit"
      />
      <!-- <sp-color-slider
      :alpha="true"
      style="margin: 4px 12px; width: calc(100% - 24px)"
    /> -->
    </template>
    <sp-divider style="margin: 0" />
    <sp-item-list-item
      :selectedItem="selectedLayer"
      :items="project.root.children"
      @pointerdown="selectLayer"
      @move="move"
    >
      <template #default="{ item }">
        <div style="padding: 2px 0 2px 0">
          {{ item.name }}
        </div>
      </template>
    </sp-item-list-item>
  </sp-split-view-pane>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import { Layer, Project } from "~/mira";

@Component({})
export default class LayerPanel extends Vue {
  @Prop() treeWidth!: number;
  @PropSync("projectSync")
  project!: Project;

  @PropSync("selectedLayerS")
  selectedLayer!: Layer | null;

  selectLayer(layer: Layer) {
    this.selectedLayer = layer;
  }

  updateEmit() {
    this.$emit("update");
  }

  deleteLayer() {
    const i = this.project.root.children.findIndex(
      (l) => l == this.selectedLayer
    );
    if (i != -1) {
      this.project.root.children.splice(i, 1);
      if (this.project.root.children.length == 0) {
        this.selectedLayer = null;
      } else if (this.project.root.children[i - 1]) {
        this.selectedLayer = this.project.root.children[i - 1];
      } else if (this.project.root.children[i]) {
        this.selectedLayer = this.project.root.children[i];
      } else {
        this.selectedLayer = this.project.root.children[0];
      }
    }
  }

  addLayer() {
    const nl = new Layer();
    nl.init(this.project.width, this.project.height);
    nl.canvas.width = this.project.width;
    nl.canvas.height = this.project.height;
    this.project.root.children.push(nl);
    this.selectedLayer = nl;
  }

  // item: darging
  // i: insert target
  move(p: { item: Layer; i: number }) {
    const i = p.i;
    const layers = this.project.root.children;
    if (layers[i] == p.item) return;

    const j = layers.findIndex((l) => l == p.item);
    if (j != -1) layers.splice(j, 1);
    let offset = -1;
    if (j > i) offset = 0;
    layers.splice(i + offset, 0, p.item);
  }
}
</script>