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

  @include medium-screen {
    margin-left: 35px;
    padding-left: 35px;
  }
}
</style>
