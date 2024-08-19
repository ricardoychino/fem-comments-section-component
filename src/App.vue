<script setup lang="ts">
import CommentsSection from '@/components/CommentsSection.vue'
import TooltipContainer from '@/components/TooltipContainer.vue'
import { useLoggedUserStore } from '@/stores/loggedUser'
import { onMounted } from 'vue'

const { userLogin } = useLoggedUserStore()

onMounted(() => {
  userLogin({
    username: 'maxblagun',
    password: 'user'
  })
})
</script>

<template>
  <div class="page-wrapper">
    <div class="container">
      <CommentsSection />
    </div>

    <TooltipContainer position="bottom-right" />
  </div>
</template>

<style scoped></style>
