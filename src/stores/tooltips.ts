import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import type { Tooltip, TooltipThemes } from '@/types/Tooltips.d.ts'

type AppendFnOptions = {
  duration?: number,
  closable?: boolean
}

export const useTooltipsStore = defineStore('tooltips', () => {
  const internalList = ref<Tooltip[]>([])
  const keyControl = ref(1)

  const tooltips = computed(() => [...internalList.value])

  const append = (theme: TooltipThemes = 'neutral', text: string, options: AppendFnOptions = { duration: 3000, closable: false }) => {
    const instance: Tooltip = {
      theme,
      text,
      closable: options.closable || false,
      key: `tooltip-${keyControl.value}`
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

  return { tooltips, append }
})

