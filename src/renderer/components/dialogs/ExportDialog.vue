<template>
  <sp-dialog
    :dismissable="true"
    :isOpen="isOpen"
    header="Download PSD File"
    @close="isOpen = false"
  >
    <sp-button @click="download">Download</sp-button>
  </sp-dialog>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Psd, writePsd } from "ag-psd";
import { download } from "~/utils/download";
import { Project } from "~/mira";
import { makeResultCanvas } from "~/mira/utils";

@Component({})
export default class ExportDialog extends Vue {
  @Prop() project!: Project;

  isOpen: boolean = false;

  /**
   * open the modal.
   */
  public open() {
    this.isOpen = true;
  }

  /**
   * close the modal.
   */
  private close() {
    this.isOpen = false;
  }

  /**
   * download the project as psd file.
   */
  private download() {
    const psd: Psd = {
      width: this.project.width,
      height: this.project.height,
      children: this.project.root.children.map((c) => {
        return {
          name: c.name,
          opacity: c.opacity,
          canvas: c.canvas,
        };
      }),
      canvas: makeResultCanvas(this.project),
    };
    const buffer = writePsd(psd);
    download(new Blob([new Uint8Array(buffer)]), this.project.name + ".psd");
  }
}
</script>