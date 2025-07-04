// src/stores/lead.store.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { LeadService, type Lead, type NewLead } from '@/services/leadsService'
export const useLeadStore = defineStore('lead', () => {
  const leads = ref<Lead[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref<string | null>(null)

  async function getAllLeads(userId: number) {
    try {
      loading.value = true
      error.value = null
      const data = await LeadService.getAllLeads(userId)
      leads.value = data.rows || data
      console.log(data)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar leads'
    } finally {
      loading.value = false
    }
  }

  async function filterLeadsByTag(tagId: number) {
    try {
      loading.value = true
      error.value = null
      const data = await LeadService.filterLeadsByTag(tagId)
      leads.value = data.rows || data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al filtrar leads'
    } finally {
      loading.value = false
    }
  }

  async function updateLeadTag(leadId: number, tagId: number) {
    try {
      loading.value = true
      error.value = null
      await LeadService.updateLeadTag(leadId, tagId)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al actualizar tag'
    } finally {
      loading.value = false
    }
  }

  async function createLead(lead: NewLead) {
    try {
      loading.value = true
      error.value = null
      success.value = null
      const result = await LeadService.createLead(lead)
      success.value = result.message
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al crear lead'
    } finally {
      loading.value = false
    }
  }

  return {
    leads,
    loading,
    error,
    success,
    getAllLeads,
    filterLeadsByTag,
    updateLeadTag,
    createLead,
  }
})
