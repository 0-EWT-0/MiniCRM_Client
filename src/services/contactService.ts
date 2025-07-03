// src/services/contact.service.ts

import axios from '@/config/axios'

interface Contact {
  name: string
  email: string
  phone: string
  message: string
}

const baseURL = import.meta.env.VITE_API_URL

export const ContactService = {
  async registerContact(data: Contact) {
    const response = await axios.post(`${baseURL}/contact/registerContact`, data)
    return response.data
  },
}
