// src/stores/auth.store.ts

import { defineStore } from 'pinia'
import { AuthService } from '@/services/authService'
import { ref } from 'vue'
import axios from '@/config/axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token') || null)
  const user = ref<{ name: string; email: string } | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  if (token.value) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      const payload = JSON.parse(atob(token.value.split('.')[1]))
      user.value = {
        name: payload.sessionData.name,
        email: payload.sessionData.email,
      }
    } catch (e) {
      // Token inválido o corrupto, lo eliminamos
      console.warn('Token inválido detectado, limpiando sesión')
      token.value = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    }
  }

  async function login(email: string, password: string) {
    try {
      loading.value = true
      error.value = null

      const res = await AuthService.login({ email, password })

      if (!res.token) throw new Error('Token no recibido')

      token.value = res.token
      localStorage.setItem('token', res.token)

      const payload = JSON.parse(atob(res.token.split('.')[1]))
      user.value = {
        name: payload.sessionData.name,
        email: payload.sessionData.email,
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${res.token}`
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Error de login'
    } finally {
      loading.value = false
    }
  }

  async function register(name: string, email: string, password: string, is_accepted: boolean) {
    try {
      loading.value = true
      error.value = null
      await AuthService.register({ name, email, password, is_accepted })
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error de registro'
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  return {
    token,
    user,
    loading,
    error,
    login,
    register,
    logout,
  }
})
