// src/services/lead.service.ts

import axios from '@/config/axios'

export interface Lead {
  lead_id: number
  name: string
  tittle: string
  description: string
  email: string
  number: string
  id_tag_id: number
  id_user_id: number
}

export type NewLead = Omit<Lead, 'lead_id'>

const baseURL = import.meta.env.VITE_API_URL

export const LeadService = {
  async getAllLeads(userId: number) {
    const response = await axios.get(`${baseURL}/leads/getAllLeads/${userId}`)
    return response.data
  },

  async filterLeadsByTag(tagId: number) {
    const response = await axios.get(`${baseURL}/leads/filterLead/${tagId}`)
    return response.data
  },

  async updateLeadTag(leadId: number, tagId: number) {
    const parsedTagId = Number(tagId)

    if (isNaN(parsedTagId)) {
      throw new Error('El ID de la etiqueta no es válido')
    }

    const response = await axios.patch(`${baseURL}/leads/updateLeadTag/${leadId}`, {
      tag_id: parsedTagId,
    })

    return response.data
  },

  async createLead(lead: NewLead) {
    const response = await axios.post(`${baseURL}/leads/createLead`, lead)
    return response.data
  },
}
