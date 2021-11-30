<template>
  <sp-dialog
    :isOpen="isOpenSettings"
    header="Settings"
    @close="isOpenSettings = false"
  >
    <sp-textfield v-model="name" />
    <div style="display: flex; width: 256px">
      <div style="width: auto">
        <sp-field-label>Width</sp-field-label>
        <sp-textfield v-model="width" style="width: auto" />
      </div>
      <div style="width: auto">
        <sp-field-label>Height</sp-field-label>
        <sp-textfield v-model="height" style="width: auto" />
      </div>
    </div>
    <template #footer>
      <sp-button-group :dialog="true">
        <sp-button type="primary" :group="true" @click="close">
          Cancel
        </sp-button>
        <sp-button :group="true" @click="save">Save</sp-button>
      </sp-button-group>
    </template>
  </sp-dialog>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, PropSync } from "vue-property-decorator";
import { Project } from "~/mira";

@Component({})
export default class SettingsDialog extends Vue {
  @PropSync("projectSync") project!: Project;
  private isOpenSettings: boolean = false;
  private width: number = 0;
  private height: number = 0;
  private name: string = "";

  public open() {
    this.isOpenSettings = true;
    this.width = this.project.width;
    this.height = this.project.height;
    this.name = this.project.name;
  }

  private close() {
    this.isOpenSettings = false;
  }

  private save() {
    this.project.width = this.width;
    this.project.height = this.height;
    this.project.name = this.name;
    this.project.resize();
    this.isOpenSettings = false;
  }
}
</script>