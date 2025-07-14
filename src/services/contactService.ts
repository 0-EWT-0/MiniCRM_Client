// src/services/contact.service.ts

import axios from '@/config/axios'

interface Contact {
  name: string
  email: string
  number: string
  id_tag_id: number
}

const baseURL = import.meta.env.VITE_API_URL

export const ContactService = {
  async registerContact(data: Contact) {
    console.log('Registering contact:', data)
    const response = await axios.post(`${baseURL}/leads/createLead`, data)
    return response.data
  },
}
