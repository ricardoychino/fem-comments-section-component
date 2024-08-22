<script setup lang="ts">
import { computed } from 'vue'
import UserAvatar from '@/components/UserAvatar.vue'

import type { User } from '@/types/Comments'

const props = withDefaults(
  defineProps<{
    user: User | null
    isSelf?: boolean
    time: string | number
  }>(),
  {
    isSelf: false
  }
)

const avatarImageURL = computed(() => props.user?.image.webp || props.user?.image.png || '')
const visibleUsername = computed(() => props.user?.username || 'Unknown user')

const visibleTime = computed(() =>
  typeof props.time === 'number' ? convertToRange(props.time) : props.time
)

const convertToRange = (timestamp: number) => {
  const thresholds = {
    month: 2629743,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  }
  const base = Math.floor(Date.now() / 1000) - timestamp

  let res = 'now'

  // Full date if > 1 year
  if (base > 31556926) {
    const dateObj = new Date(timestamp)
    res = `${dateObj.getMonth()}/${dateObj.getDate()}/${dateObj.getFullYear()}`
  } else {
    for (const [key, seconds] of Object.entries(thresholds)) {
      if (base / seconds >= 1) {
        const amount = Math.floor(base / seconds)
        res = `${amount} ${key}${amount > 1 ? 's' : ''} ago`
        break
      }
    }
  }

  return res
}
</script>

<template>
  <div class="comment-details">
    <UserAvatar size="36px" :url="avatarImageURL" :username="visibleUsername" />

    <h4 class="username">
      {{ visibleUsername }} <span class="self-badge" v-if="isSelf">you</span>
    </h4>

    <time class="time">{{ visibleTime }}</time>
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

    @include medium-screen {
      margin-left: unset;
    }
  }

  @include medium-screen {
    gap: 20px;
  }
}
</style>
