// src/views/LoginView.vue
<template>
  <div class="auth-container">
    <h1>Iniciar sesión</h1>
    <form @submit.prevent="handleLogin">
      <input type="email" v-model="email" placeholder="Correo electrónico" required />
      <input type="password" v-model="password" placeholder="Contraseña" required />
      <button type="submit" :disabled="authStore.loading">
        {{ authStore.loading ? 'Cargando...' : 'Entrar' }}
      </button>
      <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
    </form>
    <p class="switch-link">
      ¿No tienes cuenta? <RouterLink to="/register">Regístrate aquí</RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  await authStore.login(email.value, password.value)
  if (authStore.token) {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
}
.auth-container input {
  display: block;
  margin: 1rem auto;
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
}
.auth-container button {
  background-color: #14b8a6;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
  width: 100%;
}
.auth-container button:hover {
  background-color: #0d9488;
}
.error {
  color: #dc2626;
  margin-top: 1rem;
}
.switch-link {
  margin-top: 1.5rem;
}
</style>
