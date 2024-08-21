<script setup lang="ts">
import CommentsSection from '@/components/CommentsSection.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import TestingControls from '@/components/TestingControls.vue'
import { useLoggedUserStore } from '@/stores/loggedUser'
import { onMounted } from 'vue'
</script>

<template>
  <div class="page-wrapper">
    <div class="container">
      <CommentsSection />
    </div>

    <ToastContainer position="bottom-right" />

    <TestingControls />
  </div>
</template>

<style scoped></style>
