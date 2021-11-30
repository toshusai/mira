<template>
  <!-- Left Tool Bar -->
  <sp-split-view-pane style="padding: 4px">
    <sp-action-group :vertical="true">
      <sp-action-button
        ref="pencilButton"
        :item="true"
        :quiet="true"
        :emphasized="tool == Tool.Pencil"
        :selected="tool == Tool.Pencil"
        :corner="true"
        @pointerdown="openPencilPop"
      >
        <sp-icon name="Brush"></sp-icon>
      </sp-action-button>
      <sp-action-button
        ref="eraserButton"
        :emphasized="tool == Tool.Eraser"
        :selected="tool == Tool.Eraser"
        :item="true"
        :quiet="true"
        :corner="true"
        @pointerdown="openEraserPop"
      >
        <sp-icon name="Erase"></sp-icon>
      </sp-action-button>
      <!-- <sp-action-button :item="true" :quiet="true" disabled>
        <sp-icon name="Sampler"></sp-icon>
      </sp-action-button>
      <sp-action-button :item="true" :quiet="true" disabled>
        <sp-icon name="RectSelect"></sp-icon>
      </sp-action-button> -->
      <sp-divider />
      <color-button
        ref="color1Button"
        :selected="colorButtonIndex == 0"
        :colorSync.sync="color1"
        @change="changeColor1"
        @pointerdown="selectColor(0)"
      ></color-button>
      <color-button
        ref="color2Button"
        :selected="colorButtonIndex == 1"
        :colorSync.sync="color2"
        @change="changeColor2"
        @pointerdown="selectColor(1)"
      ></color-button>
    </sp-action-group>
    <i-pencil-popover
      ref="pencilPopover"
      :ipencilSync.sync="pencil"
      :selected="tool == Tool.Pencil"
    />
    <i-pencil-popover
      ref="eraserPopover"
      :ipencilSync.sync="eraser"
      :selected="tool == Tool.Eraser"
    />
  </sp-split-view-pane>
</template>

<script lang="ts">
import { Color, SpActionButton } from "@toshusai/spectrum-vue";
import Vue from "vue";
import { Component, PropSync, Ref } from "vue-property-decorator";
import ColorButton from "./ColorButton.vue";
import IPencilPopover from "./IPencilPopover.vue";
import { Pencil, Project, Tool } from "~/mira";

@Component({
  components: {
    ColorButton,
    IPencilPopover,
  },
})
export default class LeftToolBar extends Vue {
  @PropSync("projectSync") project!: Project;
  @PropSync("toolSync") tool!: Tool;
  @PropSync("pencilSync") pencil!: Pencil;
  @PropSync("eraserSync") eraser!: Pencil;

  @Ref() pencilPopover!: IPencilPopover;
  @Ref() eraserPopover!: IPencilPopover;
  @Ref() color1Button!: ColorButton;
  @Ref() color2Button!: ColorButton;
  @Ref() pencilButton!: SpActionButton;
  @Ref() eraserButton!: SpActionButton;

  color1: Color = new Color();
  color2: Color = new Color();

  colorButtonIndex: number = 0;

  selectedColor: number = 1;

  Tool = Tool;

  mounted() {
    this.color2.r = 255;
    this.color2.g = 255;
    this.color2.b = 255;
  }

  openPencilPop() {
    if (this.tool == Tool.Pencil)
      this.pencilPopover.open(this.pencilButton.$el as HTMLElement);
    this.tool = Tool.Pencil;
  }

  openEraserPop() {
    if (this.tool == Tool.Eraser)
      this.eraserPopover.open(this.eraserButton.$el as HTMLElement);
    this.tool = Tool.Eraser;
  }

  selectColor(index: number) {
    this.colorButtonIndex = index;
    if (index == 0) {
      this.pencil.color = this.color1;
    } else if (index == 1) {
      this.pencil.color = this.color2;
    }
  }

  changeColor1(color: Color) {
    this.pencil.color = color;
  }

  changeColor2(color: Color) {
    this.pencil.color = color;
  }
}
</script>