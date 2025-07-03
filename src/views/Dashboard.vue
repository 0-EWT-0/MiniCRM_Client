<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Panel de Leads</h1>
      <div class="controls">
        <select v-model="selectedTag" @change="filterByTag">
          <option value="">Todos</option>
          <option v-for="tag in tagStore.tags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
        </select>
        <button @click="showModal = true">+ Agregar Lead</button>
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
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="lead in leadStore.leads" :key="lead.lead_id">
          <td>{{ lead.name }}</td>
          <td>{{ lead.email }}</td>
          <td>{{ lead.number }}</td>
          <td>{{ lead.tittle }}</td>
          <td>{{ lead.description }}</td>
          <td>
            <select v-model="lead.id_tag_id" @change="updateTag(lead.lead_id, lead.id_tag_id)">
              <option v-for="tag in tagStore.tags" :key="tag.id" :value="tag.id">
                {{ tag.name }}
              </option>
            </select>
          </td>
          <td>
            <button @click="editLead(lead)">Editar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Nuevo Lead</h2>
        <form @submit.prevent="submitNewLead">
          <input v-model="newLead.name" placeholder="Nombre" required />
          <input v-model="newLead.email" placeholder="Correo" required />
          <input v-model="newLead.number" placeholder="Teléfono" required />
          <input v-model="newLead.tittle" placeholder="Título" required />
          <textarea v-model="newLead.description" placeholder="Descripción" required></textarea>
          <select v-model="newLead.id_tag_id" required>
            <option disabled value="">Selecciona etiqueta</option>
            <option v-for="tag in tagStore.tags" :key="tag.id" :value="String(tag.id)">
              {{ tag.name }}
            </option>
          </select>
          <button type="submit">Crear</button>
          <button type="button" @click="showModal = false">Cancelar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLeadStore } from '@/stores/leads'
import { useTagStore } from '@/stores/tags'
const leadStore = useLeadStore()
const tagStore = useTagStore()

const selectedTag = ref('')
const showModal = ref(false)
const newLead = ref<{
  name: string
  email: string
  number: string
  tittle: string
  description: string
  id_tag_id: string
  id_user_id: number
}>({
  name: '',
  email: '',
  number: '',
  tittle: '',
  description: '',
  id_tag_id: '',
  id_user_id: 3,
})

onMounted(async () => {
  await tagStore.getAllTags(3)
  await leadStore.getAllLeads(3)
})

const onTagChange = async (event: Event, leadId: number) => {
  const selectedTagId = Number((event.target as HTMLSelectElement).value)
  if (!isNaN(selectedTagId)) {
    await leadStore.updateLeadTag(leadId, selectedTagId)
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

const updateTag = async (leadId: number, tagId: number) => {
  await leadStore.updateLeadTag(leadId, tagId)
}

const submitNewLead = async () => {
  const parsedTagId = Number(newLead.value.id_tag_id)
  if (!parsedTagId || isNaN(parsedTagId)) {
    alert('Etiqueta inválida')
    return
  }

  const payload = {
    ...newLead.value,
    id_tag_id: parsedTagId,
  }

  await leadStore.createLead(payload)

  if (!leadStore.error?.value) {
    await leadStore.getAllLeads(3)
    showModal.value = false
    newLead.value = {
      name: '',
      email: '',
      number: '',
      tittle: '',
      description: '',
      id_tag_id: '',
      id_user_id: 3,
    }
  }
}


const editLead = (lead: any) => {
  console.log('Editar lead', lead)
  // implementar lógica si es necesario
}
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.controls {
  display: flex;
  gap: 1rem;
}

select,
input,
textarea,
button {
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.leads-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
}

.leads-table th,
.leads-table td {
  padding: 0.75rem 1rem;
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
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
