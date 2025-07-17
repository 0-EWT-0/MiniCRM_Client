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
        <!-- <button @click="openModal">+ Agregar Lead</button> -->
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
  background: linear-gradient(to bottom, #f1f5f9, #e2e8f0);
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
}

.controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.controls select {
  padding: 0.6rem 1rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  transition: all 0.3s ease;
  color: #1e293b;
}

.controls button {
  background-color: #6366f1;
  color: white;
  font-weight: 600;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: none;
  transition: background 0.3s;
}
.controls button:hover {
  background-color: #4f46e5;
}

.leads-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.leads-table thead {
  background-color: #f8fafc;
}

.leads-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #475569;
  font-size: 0.95rem;
  border-bottom: 1px solid #e2e8f0;
}

.leads-table td {
  padding: 0.9rem 1rem;
  color: #334155;
  font-size: 0.95rem;
  border-bottom: 1px solid #e2e8f0;
}

.leads-table select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-content {
  background: #ffffff;
  padding: 2rem;
  border-radius: 18px;
  width: 90%;
  max-width: 520px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-content h2 {
  font-size: 1.5rem;
  color: #1f2937;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
}

.form-styled input,
.form-styled textarea,
.form-styled select {
  width: 100%;
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-size: 1rem;
  background-color: #f9fafb;
  transition: border-color 0.2s ease;
}

.form-styled input:focus,
.form-styled textarea:focus,
.form-styled select:focus {
  border-color: #6366f1;
  outline: none;
}

.form-styled textarea {
  resize: vertical;
  min-height: 100px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.modal-buttons button {
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.modal-buttons button[type='submit'] {
  background-color: #10b981;
  color: white;
}
.modal-buttons button[type='submit']:hover {
  background-color: #059669;
}
.modal-buttons button[type='submit']:disabled {
  background-color: #6ee7b7;
  cursor: not-allowed;
}

.modal-buttons button[type='button'] {
  background-color: #f1f5f9;
  color: #1f2937;
}
.modal-buttons button[type='button']:hover {
  background-color: #e2e8f0;
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
