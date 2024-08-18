<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

/* Solution by this article: https://mkay11.medium.com/heres-a-simple-solution-to-incorporate-inline-svgs-in-vue-vite-da5897a480f7 */

const props = defineProps<{
  type: 'delete' | 'edit' | 'minus' | 'plus' | 'reply' | 'close'
}>()

const Icon = defineAsyncComponent(() => import(`@/assets/icons/icon-${props.type}.svg`))
</script>

<template>
  <component :is="Icon" />
</template>
