// src/services/tag.service.ts

import axios from '@/config/axios'

export interface Tag {
  tag_id: number
  name: string
}

const baseURL = import.meta.env.VITE_API_URL

export const TagService = {
  async getAllTags() {
    const response = await axios.get(`${baseURL}/tag/getAllTags`)
    return response.data
  },
}
