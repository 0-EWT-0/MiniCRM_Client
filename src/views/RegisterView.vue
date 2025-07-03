<template>
  <div class="register">
    <h1>Crear cuenta</h1>

    <form @submit.prevent="handleSubmit">
      <input type="text" v-model.trim="name" placeholder="Nombre completo" required />
      <input type="email" v-model.trim="email" placeholder="Correo electrónico" required />
      <input type="password" v-model="password" placeholder="Contraseña" required />

      <label class="checkbox">
        <input type="checkbox" v-model="isAccepted" required />
        Acepto los <a href="#" target="_blank">términos y condiciones</a>
      </label>

      <button type="submit" :disabled="auth.loading">
        {{ auth.loading ? 'Registrando...' : 'Registrarse' }}
      </button>

      <p v-if="auth.error" class="error">{{ auth.error }}</p>

      <RouterLink to="/login" class="login-link">¿Ya tienes cuenta? Inicia sesión</RouterLink>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const isAccepted = ref(false)

const handleSubmit = async () => {
  await auth.register(name.value, email.value, password.value, isAccepted.value)
  if (!auth.error) {
    router.push('/login')
  }
}
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', sans-serif;
}

.register h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

form {
  display: grid;
  gap: 1rem;
}

input[type='text'],
input[type='email'],
input[type='password'] {
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  width: 100%;
}

button {
  padding: 0.8rem;
  background-color: #14b8a6;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background-color: #0d9488;
}

.error {
  color: #dc2626;
  text-align: center;
  font-weight: 500;
}

.login-link {
  text-align: center;
  display: block;
  margin-top: 1rem;
  color: #2563eb;
  text-decoration: underline;
  font-size: 0.95rem;
}

.checkbox {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  gap: 0.5rem;
  color: #334155;
}
</style>
