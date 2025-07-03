<template>
  <div>
    <Header />

    <section class="hero">
      <h1>Transforma tu gestión de clientes con CRMFlow</h1>
      <p>Una plataforma moderna, sencilla y efectiva para administrar tus prospectos y clientes.</p>
      <RouterLink to="/register" class="btn-demo">Probar gratis</RouterLink>
    </section>

    <section class="contact-section" id="contacto">
      <h2>¡Contáctanos!</h2>
      <form @submit.prevent="handleSubmit" class="contact-form" novalidate>
        <input
          type="text"
          v-model.trim="name"
          placeholder="Tu nombre"
          required
        />
        <span v-if="!name && submitted" class="error">Nombre requerido</span>

        <input
          type="email"
          v-model.trim="email"
          placeholder="Correo electrónico"
          required
        />
        <span v-if="!isValidEmail(email) && submitted" class="error">Correo inválido</span>

        <input
          type="tel"
          v-model.trim="phone"
          placeholder="Teléfono (opcional)"
          pattern="\\+?[0-9\\-\\s]+"
        />

        <textarea
          v-model.trim="message"
          placeholder="Escribe tu mensaje..."
          rows="4"
          required
        ></textarea>
        <span v-if="!message && submitted" class="error">Mensaje requerido</span>

        <button type="submit" :disabled="contactStore.loading">
          {{ contactStore.loading ? 'Enviando...' : 'Enviar mensaje' }}
        </button>

        <p v-if="contactStore.success" class="success">{{ contactStore.success }}</p>
        <p v-if="contactStore.error" class="error">{{ contactStore.error }}</p>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useContactStore } from '@/stores/contact'
import Header from '@/components/Header.vue'
import { RouterLink } from 'vue-router'

const contactStore = useContactStore()

const name = ref('')
const email = ref('')
const phone = ref('')
const message = ref('')
const submitted = ref(false)

const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

const handleSubmit = async () => {
  submitted.value = true

  if (!name.value || !isValidEmail(email.value) || !message.value) return

  await contactStore.registerContact(name.value, email.value, phone.value, message.value)

  if (!contactStore.error) {
    name.value = ''
    email.value = ''
    phone.value = ''
    message.value = ''
    submitted.value = false
  }
}
</script>

<style scoped>
.hero {
  background: linear-gradient(to right, #fff4d6, #c1f3e0);
  padding: 6rem 2rem;
  text-align: center;
  color: #1f2937;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.btn-demo {
  background-color: #14b8a6;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-demo:hover {
  background-color: #0d9488;
}

.contact-section {
  padding: 4rem 2rem;
  background-color: #ffffff;
  text-align: center;
}

.contact-form {
  max-width: 500px;
  margin: 2rem auto 0;
  display: grid;
  gap: 1rem;
}

.contact-form input,
.contact-form textarea {
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
}

.contact-form button {
  background-color: #14b8a6;
  color: white;
  font-weight: 600;
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  transition: background 0.3s;
  cursor: pointer;
}

.contact-form button:hover {
  background-color: #0d9488;
}

.success {
  color: #16a34a;
  font-weight: bold;
}

.error {
  color: #dc2626;
  font-size: 0.9rem;
  text-align: left;
  margin-top: -0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .contact-form {
    padding: 0 1rem;
  }
}
</style>
