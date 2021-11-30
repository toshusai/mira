<template>
  <sp-popover ref="popover">
    <div style="width=200px; height:200px">
      <sp-slider
        :label="`size`"
        :value="ipencil.size"
        :min="1"
        :max="100"
        :valueText="ipencil.size.toFixed(0)"
        @input="(v) => (ipencil.size = v)"
      />
      <sp-slider
        :label="`opacity`"
        :value="opacity"
        :valueText="opacity.toFixed(2)"
        :min="0"
        :max="1"
        @input="changeOpacity"
      />
      <sp-slider
        :label="`pressure size`"
        :value="ipencil.pressureSizeWeight"
        :min="0"
        :max="1"
        :valueText="ipencil.pressureSizeWeight.toFixed(2)"
        @input="(v) => (ipencil.pressureSizeWeight = v)"
      />
      <sp-slider
        :label="`pressure opacity`"
        :value="ipencil.pressureOpacityWeight"
        :min="0"
        :max="1"
        :valueText="ipencil.pressureOpacityWeight.toFixed(2)"
        @input="(v) => (ipencil.pressureOpacityWeight = v)"
      />
    </div>
  </sp-popover>
</template>
<script lang="ts">
import { SpPopover } from "@toshusai/spectrum-vue";
import Vue from "vue";
import { Component, Prop, PropSync, Ref } from "vue-property-decorator";
import { IPencil } from "~/mira";

@Component({})
export default class IPencilPopover extends Vue {
  @Ref() popover!: SpPopover;
  @PropSync("ipencilSync") ipencil!: IPencil;
  @Prop() selected!: boolean;

  r = 3;

  changeOpacity(v: number) {
    this.ipencil.opacity = Math.pow(v, this.r);
  }

  get opacity() {
    return Math.pow(this.ipencil.opacity, 1 / this.r);
  }

  open(el: HTMLElement) {
    this.popover.open(el);
  }
}
</script>