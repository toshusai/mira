<template>
  <sp-split-view-pane style="display: flex">
    <sp-action-button
      :item="true"
      :quiet="true"
      :projectSync.sync="project"
      @click="openImportDialog"
    >
      <sp-icon name="Import"></sp-icon>
    </sp-action-button>
    <div style="margin: auto"></div>
    <sp-action-button :item="true" :quiet="true" @click="openExportDialog">
      <sp-icon name="Export"></sp-icon>
    </sp-action-button>
    <sp-action-button :item="true" :quiet="true" @click="openSettingsDialog">
      <sp-icon name="Settings"></sp-icon>
    </sp-action-button>

    <settings-dialog ref="settingsDialog" :projectSync.sync="project" />
    <import-dialog ref="importDialog" :projectSync.sync="project" />
    <export-dialog ref="exportDialog" :project="project" />
  </sp-split-view-pane>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, PropSync, Ref } from "vue-property-decorator";
import { Project } from "../models/ie/Project";
import SettingsDialog from "./modals/SettingsDialog.vue";
import ImportDialog from "./modals/ImportDialog.vue";
import ExportDialog from "./modals/ExportDialog.vue";

@Component({
  components: {
    SettingsDialog,
    ImportDialog,
    ExportDialog,
  },
})
export default class AppHeader extends Vue {
  @PropSync("projectSync") project!: Project;

  @Ref() settingsDialog!: SettingsDialog;
  @Ref() importDialog!: ImportDialog;
  @Ref() exportDialog!: ExportDialog;

  openSettingsDialog() {
    this.settingsDialog.open();
  }

  openExportDialog() {
    this.exportDialog.open();
  }

  openImportDialog() {
    this.importDialog.open();
  }
}
</script>