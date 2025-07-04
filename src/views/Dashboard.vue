<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useLeadStore } from '@/stores/leads'
import { useTagStore } from '@/stores/tags'
import { useAuthStore } from '@/stores/auth'

const leadStore = useLeadStore()
const tagStore = useTagStore()
const auth = useAuthStore()
const userId = computed(() => auth.user?.id)

const selectedTag = ref('')
const showModal = ref(false)

const leadForm = reactive({
  name: '',
  email: '',
  number: '',
  tittle: '',
  description: '',
  id_tag_id: null as number | null,
  id_user_id: userId.value ?? 0,
})

watch(
  () => userId.value,
  (newId) => {
    if (newId) {
      leadForm.id_user_id = newId
    }
  },
  { immediate: true },
)

onMounted(async () => {
  auth.initializeUserFromToken()

  if (userId.value) {
    await tagStore.getAllTags()
    await leadStore.getAllLeads(userId.value)
  } else {
    console.warn('❌ Usuario no autenticado o ID no disponible')
  }
})

const displayedLeads = computed(() => leadStore.leads)

const updateTag = async (leadId: number, tagId: number) => {
  const numericTagId = Number(tagId)
  if (!isNaN(numericTagId)) {
    await leadStore.updateLeadTag(leadId, numericTagId)
    await leadStore.getAllLeads(3)
  }
}

const filterByTag = async () => {
  if (!selectedTag.value) {
    await leadStore.getAllLeads(3)
  } else {
    await leadStore.filterLeadsByTag(Number(selectedTag.value))
  }
}

function openModal() {
  resetForm()
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  resetForm()
}

function resetForm() {
  Object.assign(leadForm, {
    name: '',
    email: '',
    number: '',
    tittle: '',
    description: '',
    id_tag_id: null,
    id_user_id: 3,
  })
}

const isLoading = ref(false)

async function handleSubmit() {
  const tagId = Number(leadForm.id_tag_id)
  if (!tagId || isNaN(tagId)) {
    alert('Etiqueta inválida')
    return
  }

  isLoading.value = true
  await leadStore.createLead({
    ...leadForm,
    id_tag_id: tagId,
  })

  if (!leadStore.error) {
    await leadStore.getAllLeads(3)
    closeModal()
  }
  isLoading.value = false
}
</script>

<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Panel de Leads</h1>
      <div class="controls">
        <select v-model="selectedTag" @change="filterByTag">
          <option value="">Todos</option>
          <option v-for="tag in tagStore.tags" :key="tag.tag_id" :value="tag.tag_id">
            {{ tag.name }}
          </option>
        </select>
        <button @click="openModal">+ Agregar Lead</button>
      </div>
    </header>

    <table class="leads-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>Título</th>
          <th>Descripción</th>
          <th>Etiqueta</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="lead in displayedLeads" :key="lead.lead_id">
          <td>{{ lead.name }}</td>
          <td>{{ lead.email }}</td>
          <td>{{ lead.number }}</td>
          <td>{{ lead.tittle }}</td>
          <td>{{ lead.description }}</td>
          <td>
            <select
              :value="lead.id_tag_id"
              @change="
                (e) => updateTag(lead.lead_id, Number((e.target as HTMLSelectElement).value))
              "
            >
              <option disabled value="">Selecciona etiqueta</option>
              <option v-for="tag in tagStore.tags" :key="tag.tag_id" :value="tag.tag_id">
                {{ tag.name }}
              </option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Nuevo Lead</h2>
        <form @submit.prevent="handleSubmit" class="form-styled">
          <input v-model="leadForm.name" placeholder="Nombre" required />
          <input v-model="leadForm.email" placeholder="Correo" required />
          <input v-model="leadForm.number" placeholder="Teléfono" required />
          <input v-model="leadForm.tittle" placeholder="Título" required />
          <textarea v-model="leadForm.description" placeholder="Descripción" required></textarea>
          <select v-model.number="leadForm.id_tag_id" required>
            <option disabled :value="null">Selecciona etiqueta</option>
            <option v-for="tag in tagStore.tags" :key="tag.tag_id" :value="tag.tag_id">
              {{ tag.name }}
            </option>
          </select>

          <div class="modal-buttons">
            <button type="submit" :disabled="isLoading">
              <span v-if="isLoading" class="loader"></span>
              <span v-else>Crear</span>
            </button>
            <button type="button" @click="closeModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f5f7fb;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 1.8rem;
  color: #333;
}

.controls select,
.controls button {
  padding: 0.6rem 1rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: white;
  transition: all 0.3s ease;
}

.controls button {
  background-color: #4f46e5;
  color: white;
  border: none;
  cursor: pointer;
}
.controls button:hover {
  background-color: #4338ca;
}

.leads-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.leads-table th,
.leads-table td {
  padding: 0.9rem 1rem;
  border-bottom: 1px solid #eee;
  text-align: left;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.form-styled input,
.form-styled textarea,
.form-styled select {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #fdfdfd;
  transition: border 0.2s ease;
}
.form-styled input:focus,
.form-styled textarea:focus,
.form-styled select:focus {
  border-color: #4f46e5;
  outline: none;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.modal-buttons button {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
}

.modal-buttons button[type='submit'] {
  background-color: #4f46e5;
  color: white;
}
.modal-buttons button[type='submit']:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.modal-buttons button[type='button'] {
  background-color: #e5e7eb;
  color: #333;
}

.loader {
  width: 18px;
  height: 18px;
  border: 3px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.7s linear infinite;
  margin-right: 6px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
