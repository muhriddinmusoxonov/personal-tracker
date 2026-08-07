<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background: var(--paper); color: var(--ink)">
    <div class="w-full max-w-sm animate-fade-up">
      <!-- Signature receipt-stub header -->
      <div class="receipt px-6 pt-7 pb-5 text-center" style="box-shadow: 0 1px 2px rgba(22,33,28,0.05)">
        <span
          class="inline-flex w-11 h-11 rounded-xl items-center justify-center font-display font-semibold text-xl mb-3"
          style="background: var(--brand-soft); color: var(--brand-strong)"
        >₮</span>
        <h1 class="font-display font-semibold text-2xl">Tizimga kirish</h1>
        <p class="text-sm mt-1" style="color: var(--ink-muted)">Xarajatlaringizni davom ettiring</p>
        <div class="barcode-strip mt-5" style="color: var(--ink-muted)" />
      </div>

      <UCard class="mt-4">
        <UForm :state="form" @submit="onSubmit" class="space-y-4">
          <UFormGroup label="Email" name="email">
            <UInput v-model="form.email" type="email" placeholder="email@example.com" size="lg" icon="i-lucide-mail" />
          </UFormGroup>
          <UFormGroup label="Parol" name="password">
            <UInput v-model="form.password" type="password" placeholder="••••••••" size="lg" icon="i-lucide-lock" />
          </UFormGroup>
          <UAlert v-if="error" color="red" variant="soft" :title="error" icon="i-lucide-alert-circle" />
          <UButton type="submit" block size="lg" :loading="loading" color="ledger">Kirish</UButton>
        </UForm>

        <p class="text-sm text-center mt-5" style="color: var(--ink-muted)">
          Akkountingiz yo'qmi?
          <NuxtLink to="/register" class="font-semibold" style="color: var(--brand-strong)">Ro'yxatdan o'tish</NuxtLink>
        </p>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: false })

const { request } = useApi()
const auth = useAuthStore()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  loading.value = true
  error.value = ''
  try {
    const res = await request<{ accessToken: string; user: any }>('/auth/login', {
      method: 'POST',
      body: form,
    })
    auth.setSession(res.accessToken, res.user)
    router.push('/report')
  } catch (e: any) {
    error.value = e?.data?.message || "Email yoki parol noto'g'ri"
  } finally {
    loading.value = false
  }
}
</script>
