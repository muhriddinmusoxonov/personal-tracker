<template>
  <AppShell active="add">
    <UCard class="max-w-xl mx-auto animate-fade-up">
      <template #header>
        <h2 class="font-display font-semibold text-lg">Kirim / Chiqim qo'shish</h2>
      </template>

      <div class="space-y-5">
        <!-- Sana -->
        <UFormGroup label="Sana">
          <UInput v-model="form.occurredAt" type="datetime-local" icon="i-lucide-calendar" />
        </UFormGroup>

        <!-- Balance -->
        <UFormGroup label="Balance">
          <div class="segmented w-full">
            <button
              type="button" class="flex-1 px-3.5 py-2 text-sm font-semibold"
              :style="form.balanceType === 'personal' ? activeStyle : mutedStyle"
              @click="form.balanceType = 'personal'"
            >Personal</button>
            <button
              type="button" class="flex-1 px-3.5 py-2 text-sm font-semibold"
              :style="form.balanceType === 'company' ? activeStyle : mutedStyle"
              @click="form.balanceType = 'company'"
            >Company</button>
          </div>
        </UFormGroup>

        <!-- Kirim / Chiqim -->
        <UFormGroup label="Turi">
          <div class="segmented w-full">
            <button
              type="button" class="flex-1 px-3.5 py-2 text-sm font-semibold"
              :style="form.direction === 'expense' ? expenseActiveStyle : mutedStyle"
              @click="form.direction = 'expense'"
            >Chiqim</button>
            <button
              type="button" class="flex-1 px-3.5 py-2 text-sm font-semibold"
              :style="form.direction === 'income' ? incomeActiveStyle : mutedStyle"
              @click="form.direction = 'income'"
            >Kirim</button>
          </div>
        </UFormGroup>

        <!-- Category (faqat chiqim uchun) -->
        <UFormGroup v-if="form.direction === 'expense'" label="Category">
          <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
            <button
              v-for="c in categories"
              :key="c._id"
              type="button"
              class="tile flex flex-col items-center gap-1.5 p-3 rounded-xl"
              :data-active="form.category === c._id"
              @click="form.category = c._id"
            >
              <UIcon :name="`i-lucide-${c.icon}`" class="w-5 h-5" />
              <span class="text-xs font-medium">{{ c.name }}</span>
            </button>
          </div>
        </UFormGroup>

        <!-- To'lov turi -->
        <UFormGroup label="To'lov turi">
          <div class="segmented w-full">
            <button
              type="button" class="flex-1 px-3.5 py-2 text-sm font-semibold"
              :style="form.paymentType === 'cash' ? activeStyle : mutedStyle"
              @click="form.paymentType = 'cash'"
            >Naqd</button>
            <button
              type="button" class="flex-1 px-3.5 py-2 text-sm font-semibold"
              :style="form.paymentType === 'card' ? activeStyle : mutedStyle"
              @click="form.paymentType = 'card'"
            >Karta</button>
          </div>
        </UFormGroup>

        <!-- Miqdor (kalkulyator: 25000*3) -->
        <UFormGroup label="Miqdor">
          <UInput v-model="form.amountExpression" placeholder="masalan: 25000*3" icon="i-lucide-calculator" class="money" />
          <template #help>
            <span class="money" style="color: var(--brand-strong)">Natija: {{ formatMoney(calculatedAmount) }}</span>
          </template>
        </UFormGroup>

        <UFormGroup label="Izoh (ixtiyoriy)">
          <UTextarea v-model="form.comment" placeholder="Izoh yozing..." />
        </UFormGroup>

        <!-- Chek / skrinshot yuklash -->
        <UFormGroup label="Chek yoki skrinshot">
          <input ref="fileInput" type="file" accept="image/*" capture="environment" class="hidden" @change="onFileChange" />
          <button
            type="button"
            class="w-full rounded-xl border-2 border-dashed px-4 py-5 flex flex-col items-center gap-1.5 text-sm transition"
            :style="{ borderColor: selectedFile ? 'var(--brand)' : 'var(--line)', color: selectedFile ? 'var(--brand-strong)' : 'var(--ink-muted)' }"
            @click="fileInput?.click()"
          >
            <UIcon :name="selectedFile ? 'i-lucide-image' : 'i-lucide-camera'" class="w-6 h-6" />
            <span class="font-medium">{{ selectedFile ? selectedFile.name : 'Rasm tanlash yoki skrinshot yuklash' }}</span>
          </button>
          <UCheckbox v-if="selectedFile" v-model="useAi" label="AI orqali avtomatik aniqlash (summa va category)" class="mt-2.5" />
        </UFormGroup>

        <UAlert v-if="error" color="red" variant="soft" :title="error" icon="i-lucide-alert-circle" />
        <UAlert v-if="success" color="green" variant="soft" title="Muvaffaqiyatli qo'shildi!" icon="i-lucide-check-circle" />

        <UButton block size="lg" color="ledger" :loading="loading" :disabled="true" style="cursor: not-allowed; opacity: 0.6;" @click="submit">Saqlash</UButton>
      </div>
    </UCard>
  </AppShell>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { request } = useApi()

const categories = ref<any[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const useAi = ref(true)
const loading = ref(false)
const error = ref('')
const success = ref(false)

const activeStyle = { background: 'var(--paper-alt)', color: 'var(--brand-strong)', boxShadow: '0 1px 2px rgba(22,33,28,0.06)' }
const mutedStyle = { color: 'var(--ink-muted)' }
const incomeActiveStyle = { background: 'var(--paper-alt)', color: 'var(--income)', boxShadow: '0 1px 2px rgba(22,33,28,0.06)' }
const expenseActiveStyle = { background: 'var(--paper-alt)', color: 'var(--expense)', boxShadow: '0 1px 2px rgba(22,33,28,0.06)' }

function nowLocal() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

const form = reactive({
  occurredAt: nowLocal(),
  balanceType: 'personal' as 'personal' | 'company',
  direction: 'expense' as 'expense' | 'income',
  category: '',
  paymentType: 'cash' as 'cash' | 'card',
  amountExpression: '',
  comment: '',
})

const calculatedAmount = computed(() => {
  try {
    // eslint-disable-next-line no-new-func
    // Faqat ko'rsatish uchun oddiy hisoblash (haqiqiy hisoblash backendda xavfsiz amalga oshiriladi)
    const expr = form.amountExpression.replace(/[^0-9+\-*/().]/g, '')
    if (!expr) return 0
    // eslint-disable-next-line no-eval
    const val = Function(`"use strict";return (${expr})`)()
    return typeof val === 'number' && isFinite(val) ? val : 0
  } catch {
    return 0
  }
})

function formatMoney(n: number) {
  return new Intl.NumberFormat('uz-UZ').format(n || 0) + " so'm"
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  selectedFile.value = target.files?.[0] || null
}

async function loadCategories() {
  categories.value = await request('/categories', { query: { type: form.direction } })
}
watch(() => form.direction, loadCategories)

async function submit() {
  error.value = ''
  success.value = false
  if (form.direction === 'expense' && !form.category) {
    error.value = 'Category tanlanmadi'
    return
  }
  if (!form.amountExpression && !selectedFile.value) {
    error.value = 'Miqdor kiriting yoki chek rasmini yuklang'
    return
  }

  loading.value = true
  try {
    const body = new FormData()
    body.append('direction', form.direction)
    body.append('balanceType', form.balanceType)
    body.append('paymentType', form.paymentType)
    if (form.category) body.append('category', form.category)
    if (form.amountExpression) body.append('amountExpression', form.amountExpression)
    if (form.comment) body.append('comment', form.comment)
    body.append('occurredAt', new Date(form.occurredAt).toISOString())
    if (selectedFile.value) {
      body.append('receipt', selectedFile.value)
      body.append('useAi', useAi.value ? 'true' : 'false')
    }

    await request('/transactions', { method: 'POST', body })
    success.value = true
    form.amountExpression = ''
    form.comment = ''
    selectedFile.value = null
  } catch (e: any) {
    error.value = e?.data?.message || 'Xatolik yuz berdi'
  } finally {
    loading.value = false
  }
}

onMounted(loadCategories)
</script>
