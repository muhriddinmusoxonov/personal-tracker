import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string,
    user: null as null | { id: string; email: string; fullName: string },
  }),
  actions: {
    setSession(token: string, user: any) {
      this.token = token
      this.user = user
      if (process.client) {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
      }
    },
    restore() {
      if (process.client) {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        if (token) this.token = token
        if (user) this.user = JSON.parse(user)
      }
    },
    logout() {
      this.token = ''
      this.user = null
      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },
  },
})
