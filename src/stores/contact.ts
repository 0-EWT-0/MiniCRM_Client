// src/stores/contact.store.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ContactService } from '@/services/contactService'
import { sendLeadEmail } from '@/utils/email'

export const useContactStore = defineStore('contact', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref<string | null>(null)

  async function registerContact(name: string, email: string, number: string) {
    try {
      loading.value = true
      error.value = null
      success.value = null

      console.log('Registrando contacto:', { name, email, number })

      // 1. Guardar en base de datos
      const result = await ContactService.registerContact({ name, email, number, id_tag_id: 1 })
      success.value = result.message

      // 2. Enviar correo
      await sendLeadEmail({
        to_name: 'Usuario', // puedes cambiar esto si conoces el nombre real
        to_email: email, // o reemplazarlo por el destinatario real (ej. admin)
        lead_name: name,
        lead_email: email,
        lead_number: number,
      })
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
