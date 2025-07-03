// src/stores/contact.store.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ContactService } from '@/services/contactService'

export const useContactStore = defineStore('contact', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref<string | null>(null)

  async function registerContact(name: string, email: string, phone: string, message: string) {
    try {
      loading.value = true
      error.value = null
      success.value = null

      const result = await ContactService.registerContact({ name, email, phone, message })
      success.value = result.message
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al registrar el contacto'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    success,
    registerContact,
  }
})
