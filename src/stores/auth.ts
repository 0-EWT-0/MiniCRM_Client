import { defineStore } from 'pinia'
import { AuthService } from '@/services/authService'
import { ref } from 'vue'
import axios from '@/config/axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<{ id: number; name: string; email: string } | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ✅ Cargar usuario desde el token guardado en localStorage
  function initializeUserFromToken() {
    const storedToken = localStorage.getItem('token')
    if (!storedToken) return

    try {
      const payload = JSON.parse(atob(storedToken.split('.')[1]))

      // ⚠️ Asegúrate que tu JWT usa "data" y no "sessionData"
      const session = payload.sessionData || payload.data

      user.value = {
        id: session.id,
        name: session.name,
        email: session.email,
      }

      token.value = storedToken
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
    } catch (e) {
      console.warn('Token inválido detectado, limpiando sesión')
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    }
  }

  // ✅ Login del usuario y guarda el token
  async function login(email: string, password: string) {
    try {
      loading.value = true
      error.value = null

      const res = await AuthService.login({ email, password })

      if (!res.token) throw new Error('Token no recibido')

      localStorage.setItem('token', res.token)
      token.value = res.token
      initializeUserFromToken()
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Error de login'
    } finally {
      loading.value = false
    }
  }

  // ✅ Registro de nuevo usuario
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

  // ✅ Cierre de sesión
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
    initializeUserFromToken,
  }
})
