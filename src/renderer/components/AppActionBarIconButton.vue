<template>
  <sp-action-button
    style="margin: 0"
    :item="true"
    :quiet="true"
    size="S"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <sp-icon :name="name"></sp-icon>
  </sp-action-button>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class AppActionBarIconButton extends Vue {
  @Prop({ default: "" }) name!: string;
}
</script>