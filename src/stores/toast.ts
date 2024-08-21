import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import type { Toast, ToastThemes } from '@/types/Toasts.d.ts'

type AppendFnOptions = {
  duration?: number,
  closable?: boolean
}

export const useToastsStore = defineStore('toasts', () => {
  const internalList = ref<Toast[]>([])
  const keyControl = ref(1)

  const toasts = computed(() => [...internalList.value])

  const append = (
    theme: ToastThemes = 'neutral',
    text: string,
    options: AppendFnOptions = { duration: 3000, closable: false }
  ) => {
    const instance: Toast = {
      theme,
      text,
      closable: options.closable || false,
      key: `toast-${keyControl.value}`
    }

    const timeout = options.duration || 0 > 0 ? setTimeout(() => {
      remove()
    }, options.duration) : undefined

    const remove = () => {
      const idx = internalList.value.indexOf(instance)
      internalList.value.splice(idx, 1)
      clearTimeout(timeout)
    }

    instance.handleClose = remove

    internalList.value.unshift(instance)
  }

  return { toasts, append }
})

