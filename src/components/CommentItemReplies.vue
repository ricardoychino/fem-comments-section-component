<script setup lang="ts"></script>

<template>
  <div class="replies">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.replies {
  border-left: 2px solid $neutral-400;
  padding-left: 5%;

  @media screen and (min-width: $bp-medium) {
    margin-left: 35px;
    padding-left: 35px;
  }
}
</style>
