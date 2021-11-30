<template>
  <div>
    <button
      v-bind="$attrs"
      class="btn"
      :class="cssClass"
      :style="`background: ${rgbStr}`"
      v-on="$listeners"
      @pointerdown="open"
    ></button>
    <sp-popover ref="popover">
      <sp-color-area
        :h="h"
        :color="color"
        @change="changeColor"
      ></sp-color-area>
      <sp-color-slider :h="h" @change="(v) => (h = v)"></sp-color-slider>
    </sp-popover>
  </div>
</template>

<style scoped>
.btn {
  margin: 4px;
  height: 24px;
  border: none;
  width: 24px;
  background: white;
  border-radius: 16px;
  cursor: pointer;
  position: relative;
}

.btn-select::after {
  content: "";
  position: absolute;
  top: -4px;
  right: -4px;
  bottom: -4px;
  left: -4px;
  border: 2px solid;
  border-radius: 16px;
  border-color: var(
    --spectrum-actionbutton-m-emphasized-textonly-background-color-selected,
    var(--spectrum-semantic-cta-background-color-default)
  );
}
</style>

<script lang="ts">
import { SpPopover, Color } from "@toshusai/spectrum-vue";
import Vue from "vue";
import { Component, Prop, PropSync, Ref } from "vue-property-decorator";

@Component({})
export default class ColorButton extends Vue {
  @Ref() popover!: SpPopover;

  @Prop({ default: false }) selected!: boolean;

  @PropSync("colorSync") color!: Color;

  private h: number = 90;

  get cssClass(): string[] {
    return [this.selected ? "btn-select" : ""];
  }

  get rgbStr() {
    const { r, g, b } = this.color;
    return `rgb(${r}, ${g}, ${b})`;
  }

  open(e: InputEvent) {
    if (this.selected) {
      this.popover.open(e.target as HTMLElement);
    }
  }

  changeColor(color: Color) {
    this.color = color;
    this.$emit("change", color);
  }
}
</script>
