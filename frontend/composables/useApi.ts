import { useAuthStore } from '~/stores/auth'

// Barcha backendga so'rovlar shu composable orqali yuboriladi.
export function useApi() {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  async function request<T>(path: string, options: any = {}): Promise<T> {
    return $fetch<T>(`${config.public.apiBase}${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
      },
    })
  }

  return { request }
}
