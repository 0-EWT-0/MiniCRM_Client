import axios from '../config/axios'

interface RegisterData {
  name: string
  email: string
  password: string
  is_accepted: boolean
  recaptchaToken: string
}

interface LoginData {
  email: string
  password: string
}

const baseURL = import.meta.env.VITE_API_URL

export const AuthService = {
  async register(data: RegisterData) {
    const response = await axios.post(`${baseURL}/auth/register`, data)
    return response.data
  },

  async login(data: LoginData) {
    const response = await axios.post(`${baseURL}/auth/login`, data)
    return response.data
  },
}
