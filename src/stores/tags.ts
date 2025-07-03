// src/stores/tag.store.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TagService } from '@/services/tagService'
import type { Tag } from '@/services/tagService'

export const useTagStore = defineStore('tag', () => {
  const tags = ref<Tag[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function getAllTags(userId: number) {
    try {
      loading.value = true
      error.value = null
      const data = await TagService.getAllTags(userId)
      tags.value = data.rows || data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar etiquetas'
    } finally {
      loading.value = false
    }
  }

  return {
    tags,
    loading,
    error,
    getAllTags,
  }
})
