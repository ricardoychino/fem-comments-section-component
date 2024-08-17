<script setup lang="ts">
import UserAvatar from '@/components/UserAvatar.vue'

import type { User } from '@/types/Comments'

withDefaults(
  defineProps<{
    user: User
    isSelf?: boolean
  }>(),
  {
    isSelf: false
  }
)
</script>

<template>
  <div class="comment-details">
    <UserAvatar size="36px" :url="user.image.png" :username="user.username" />

    <h4 class="username">{{ user.username }} <span class="self-badge" v-if="isSelf">you</span></h4>

    <time class="time">1 month ago</time>
  </div>
</template>

<style lang="scss" scoped>
.comment-details {
  display: flex;
  align-items: center;
  gap: 10px;

  .username {
    font-weight: 600;

    .self-badge {
      display: inline-block;
      font-size: 0.825em;
      background-color: $color-primary;
      color: #fff;
      padding: 2.5px 5px;
      border-radius: 2px;
      margin-left: 5px;
    }
  }

  time {
    color: $neutral-700;
    opacity: 0.5;
    font-size: 0.875em;
    font-weight: 500;
    margin-left: auto;

    @media screen and (min-width: $bp-medium) {
      margin-left: unset;
    }
  }

  @media screen and (min-width: $bp-medium) {
    gap: 20px;
  }
}
</style>
