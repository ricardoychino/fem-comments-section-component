<script setup lang="ts">
import CommentsSection from '@/components/CommentsSection.vue'
import { useLoggedUserStore } from '@/stores/loggedUser'
import { onMounted } from 'vue'

const { userLogin } = useLoggedUserStore()

onMounted(() => {
  userLogin({
    username: 'amyrobson',
    password: 'user'
  })
})
</script>

<template>
  <div class="page-wrapper">
    <div class="container">
      <CommentsSection />
    </div>
  </div>
</template>

<style scoped></style>
