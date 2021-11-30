<template>
  <sp-split-view-pane>
    <div style="display: flex; height: 32px">
      <sp-action-group style="margin: auto; height: 24px" :quiet="true">
        <app-action-bar-icon-button
          :disabled="!canUndo"
          name="Undo"
          @click="undo"
        />
        <app-action-bar-icon-button
          :disabled="!canRedo"
          name="Redo"
          @click="redo"
        />
        <app-action-bar-icon-button
          :selected="flipH"
          name="FlipHorizontal"
          @click="changeFlipH"
        />
      </sp-action-group>
    </div>
  </sp-split-view-pane>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, PropSync } from "vue-property-decorator";
import { UndoManager } from "../models/UndoManager";
import AppActionBarIconButton from "./AppActionBarIconButton.vue";

@Component({
  components: {
    AppActionBarIconButton,
  },
})
export default class AppActionBar extends Vue {
  @PropSync("flipHSync") flipH!: boolean;

  changeFlipH() {
    this.flipH = !this.flipH;
  }

  get canUndo() {
    return this.$store.state.canUndo;
  }

  get canRedo() {
    return this.$store.state.canRedo;
  }

  undo() {
    if (this.canUndo) UndoManager.main.undo();
    this.$store.commit("setUndo", UndoManager.main.undoLength > 0);
  }

  redo() {
    if (this.canRedo) UndoManager.main.redo();
    this.$store.commit("setRedo", UndoManager.main.redoLength > 0);
  }
}
</script>