<script setup lang="ts">
withDefaults(
  defineProps<{
    url: string
    username?: string
    size?: string
  }>(),
  {
    username: "User's",
    size: ''
  }
)
</script>

<template>
  <figure class="user-avatar" :style="{ height: size, width: size }">
    <img :src="url" :alt="`${username} avatar`" />
  </figure>
</template>

<style lang="scss" scoped>
.user-avatar {
  overflow: hidden;
  border-radius: 50%;
  height: 40px;
  width: 40px;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
    object-position: center;
  }
}
</style>
