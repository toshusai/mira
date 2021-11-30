<template>
  <sp-dialog
    :dismissable="true"
    :isOpen="isOpen"
    header="Open PSD File"
    @close="isOpen = false"
  >
    <div @drop="drop" @dragover="dragover" @dragleave="dragleave">
      <sp-dropzone :dragged="dragOver">
        <sp-button type="primary" style="margin-top: 32px" @click="openFile">
          Select a File
          <input
            ref="input"
            type="file"
            style="display: none"
            @change="changeFile"
          />
        </sp-button>
      </sp-dropzone>
    </div>
    <sp-toast ref="toast" :negative="true">
      {{ errorMessage }}
    </sp-toast>
  </sp-dialog>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, PropSync, Ref } from "vue-property-decorator";
import { SpToast } from "~/../../../spectrum-vue/dist";
import { Project } from "~/mira";
import { fileToProject } from "~/mira/utils";

@Component({})
export default class ImportDialog extends Vue {
  @PropSync("projectSync") project!: Project;

  @Ref() input!: HTMLInputElement;
  @Ref() toast!: SpToast;

  isOpen: boolean = false;
  dragOver: boolean = false;
  errorMessage = "Error";

  /**
   * open the modal.
   */
  public open() {
    this.isOpen = true;
  }

  /**
   * openFile open file picker from <input />
   */
  private openFile() {
    this.input.click();
  }

  /**
   * error show error toast with text.
   * @param msg display text.
   */
  private error(msg: string) {
    this.errorMessage = msg;
    this.toast.open(3000);
  }

  /**
   * changeFile from click select file button.
   */
  private async changeFile(e: MouseEvent) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length == 1) {
      try {
        const file = target.files[0];
        if (file.type != "image/vnd.adobe.photoshop") {
          this.error(`Unsuppoted file type ${file.type}`);
          return;
        }

        this.project = await fileToProject(file);
        this.isOpen = false;
      } catch (e) {
        this.error("Unexpected Error");
      }
    } else {
      this.error("Support only single file.");
    }
  }

  /**
   * dragover
   */
  private dragover(e: DragEvent) {
    this.dragOver = true;
    e.preventDefault();
  }

  /**
   * dragleave
   */
  private dragleave() {
    this.dragOver = false;
  }

  /**
   * close this modal
   */
  private close() {
    this.isOpen = false;
  }

  /**
   * drop file to dropzone
   */
  private async drop(e: DragEvent) {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files && files.length == 1) {
      const file = files[0];
      this.project = await fileToProject(file);
      this.isOpen = false;
    } else {
      this.error("Support only single file.");
    }
  }
}
</script>