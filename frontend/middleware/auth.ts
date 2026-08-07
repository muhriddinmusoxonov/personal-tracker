import { useAuthStore } from '~/stores/auth'

// Ro'yxatdan o'tmagan foydalanuvchini login sahifasiga qaytaradi
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  if (process.client) auth.restore()
  if (!auth.token && to.path !== '/login' && to.path !== '/register') {
    return navigateTo('/login')
  }
})
