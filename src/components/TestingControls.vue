<script setup lang="ts">
import ButtonIcon from '@/components/ButtonIcon.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { useLoggedUserStore } from '@/stores/loggedUser'
import { useCommentsStore } from '@/stores/comments'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const store = useLoggedUserStore()
const { loggedUser } = storeToRefs(store)
const { userLogin } = store

const { resetToInitial } = useCommentsStore()

const userOptions = [
  { username: 'amyrobson', avatar: '/images/avatars/image-amyrobson.webp' },
  { username: 'juliusomo', avatar: '/images/avatars/image-juliusomo.webp' },
  { username: 'maxblagun', avatar: '/images/avatars/image-maxblagun.webp' },
  { username: 'ramsesmiron', avatar: '/images/avatars/image-ramsesmiron.webp' }
]

const showOptions = ref(false)

const handleUserPick = (username: string) => {
  userLogin({
    username,
    password: 'user'
  })
}
</script>

<template>
  <Teleport to="#page-header">
    <div id="testing-controls">
      <button class="primary flat-btn" title="Reboot to initial comments" @click="resetToInitial">
        <ButtonIcon type="reboot" />
      </button>
      <button class="flat-btn" @mouseenter="showOptions = true" @mouseleave="showOptions = false">
        <UserAvatar
          :url="loggedUser?.image.webp || ''"
          :username="loggedUser?.username"
          size="40px"
        />
      </button>
      <div
        class="drop"
        v-show="showOptions"
        @mouseenter="showOptions = true"
        @mouseleave="showOptions = false"
      >
        <ul>
          <li
            v-for="{ avatar, username } in userOptions"
            :class="{ selected: loggedUser?.username === username }"
            :key="username"
            @click="() => handleUserPick(username)"
          >
            <UserAvatar :url="avatar" :username="username" size="24px" />
            {{ username }}
          </li>
        </ul>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
#testing-controls {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  min-height: 64px;
  background-color: #fff;
  border-radius: 0 10px 10px 0;
  box-shadow: 0 1px 20px -10px #{$neutral-900}b3;
  z-index: 1;

  button {
    padding: 10px;

    @include medium-screen {
      padding: 15px;
    }
  }

  .drop {
    position: absolute;
    right: 0;
    top: 100%;
    background-color: inherit;
    box-shadow: inherit;
    border-radius: 15px;
    overflow: hidden;

    ul {
      padding: 0;
      list-style: none;

      li {
        display: flex;
        align-items: center;
        font-size: 0.9em;
        font-weight: 500;
        gap: 15px;
        padding: 10px;
        cursor: pointer;

        &:not(:last-child) {
          border-bottom: 1px solid #{$neutral-900}18;
        }
        &:hover {
          background-color: $neutral-100;
        }

        &.selected > :deep(.user-avatar) {
          border: 2px solid $color-primary;
        }
      }
    }

    @include medium-screen {
      left: 90%;
      right: unset;
      top: 50%;
    }
  }

  @include medium-screen {
    flex-direction: column;
    position: fixed;
    right: unset;
    top: 20%;
  }
}
</style>
