<template>
  <AppShell active="add">
    <UCard class="max-w-xl mx-auto animate-fade-up">
      <template #header>
        <h2 class="font-display font-semibold text-lg">{{ t('income') }} / {{ t('expense') }} {{ t('add') }}</h2>
      </template>

      <div class="space-y-5">
        <!-- Sana -->
        <UFormGroup :label="t('date')">
          <UInput v-model="form.occurredAt" type="datetime-local" icon="i-lucide-calendar" />
        </UFormGroup>

        <!-- Balance -->
        <UFormGroup :label="t('balance')">
          <div class="segmented w-full">
            <button
              type="button" class="flex-1 px-3.5 py-2 text-sm font-semibold"
              :style="form.balanceType === 'personal' ? activeStyle : mutedStyle"
              @click="form.balanceType = 'personal'"
            >{{ t('personal') }}</button>
            <button
              type="button" class="flex-1 px-3.5 py-2 text-sm font-semibold"
              :style="form.balanceType === 'company' ? activeStyle : mutedStyle"
              @click="form.balanceType = 'company'"
            >{{ t('company') }}</button>
          </div>
        </UFormGroup>

        <!-- Kirim / Chiqim -->
        <UFormGroup :label="t('type')">
          <div class="segmented w-full">
            <button
              type="button" class="flex-1 px-3.5 py-2 text-sm font-semibold"
              :style="form.direction === 'expense' ? expenseActiveStyle : mutedStyle"
              @click="form.direction = 'expense'"
            >{{ t('expense') }}</button>
            <button
              type="button" class="flex-1 px-3.5 py-2 text-sm font-semibold"
              :style="form.direction === 'income' ? incomeActiveStyle : mutedStyle"
              @click="form.direction = 'income'"
            >{{ t('income') }}</button>
          </div>
        </UFormGroup>

        <!-- Category (faqat chiqim uchun) -->
        <UFormGroup v-if="form.direction === 'expense'" :label="t('category')">
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
              <span class="text-xs font-medium">{{ categoryLabel(c) }}</span>
            </button>
          </div>
        </UFormGroup>

        <!-- To'lov turi -->
        <UFormGroup :label="t('paymentType')">
          <div class="segmented w-full">
            <button
              type="button" class="flex-1 px-3.5 py-2 text-sm font-semibold"
              :style="form.paymentType === 'cash' ? activeStyle : mutedStyle"
              @click="form.paymentType = 'cash'"
            >{{ t('cash') }}</button>
            <button
              type="button" class="flex-1 px-3.5 py-2 text-sm font-semibold"
              :style="form.paymentType === 'card' ? activeStyle : mutedStyle"
              @click="form.paymentType = 'card'"
            >{{ t('card') }}</button>
          </div>
        </UFormGroup>

        <!-- Miqdor (kalkulyator: 25000*3) -->
        <UFormGroup :label="t('amount')">
          <UInput v-model="form.amountExpression" placeholder="masalan: 25000*3" icon="i-lucide-calculator" class="money" />
          <template #help>
            <span class="money" style="color: var(--brand-strong)">{{ t('result') }}: {{ formatMoney(calculatedAmount) }}</span>
          </template>
        </UFormGroup>

        <UFormGroup :label="`${t('comment')} (${t('optional')})`">
          <UTextarea v-model="form.comment" :placeholder="t('commentPlaceholder')" />
        </UFormGroup>

        <!-- Chek / skrinshot yuklash -->
        <UFormGroup :label="t('receipt')">
          <input ref="fileInput" type="file" accept="image/*" capture="environment" class="hidden" @change="onFileChange" />
          <button
          :disabled="true" style="cursor: not-allowed; opacity: 0.6;"
            type="button"
            class="w-full rounded-xl border-2 border-dashed px-4 py-5 flex flex-col items-center gap-1.5 text-sm transition"
            :style="{ borderColor: selectedFile ? 'var(--brand)' : 'var(--line)', color: selectedFile ? 'var(--brand-strong)' : 'var(--ink-muted)' }"
            @click="fileInput?.click()"
          >
            <UIcon :name="selectedFile ? 'i-lucide-image' : 'i-lucide-camera'" class="w-6 h-6" />
            <span class="font-medium">{{ selectedFile ? selectedFile.name : t('chooseImage') }}</span>
          </button>
          <UCheckbox v-if="selectedFile" v-model="useAi" :label="t('ai')" class="mt-2.5" />
        </UFormGroup>

        <UAlert v-if="error" color="red" variant="soft" :title="error" icon="i-lucide-alert-circle" />
        <UAlert v-if="success" color="green" variant="soft" :title="t('successAdded')" icon="i-lucide-check-circle" />

        <UButton block size="lg" color="ledger" :loading="loading" @click="submit">{{ t('save') }}</UButton>
      </div>
    </UCard>
  </AppShell>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { request } = useApi()
const { t, formatMoney: localizedMoney, categoryLabel } = useI18n()

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
  return localizedMoney(n)
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  selectedFile.value = target.files?.[0] || null
}

async function loadCategories() {
  categories.value = await request('/categories', { query: { type: form.direction } })
}
watch(() => form.direction, () => {
  // Kirim/Chiqim almashtirilganda avval tanlangan category eskirib qoladi,
  // shuning uchun har safar yo'nalish o'zgarganda tozalaymiz.
  form.category = ''
  loadCategories()
})

async function submit() {
  error.value = ''
  success.value = false
  if (form.direction === 'expense' && !form.category) {
    error.value = t('categoryRequired')
    return
  }
  if (!form.amountExpression && !selectedFile.value) {
    error.value = t('amountRequired')
    return
  }

  loading.value = true
  try {
    const body = new FormData()
    body.append('direction', form.direction)
    body.append('balanceType', form.balanceType)
    body.append('paymentType', form.paymentType)
    // Kirim uchun category hech qachon yuborilmasin (ehtiyot chorasi)
    if (form.direction === 'expense' && form.category) body.append('category', form.category)
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
    error.value = e?.data?.message || t('error')
  } finally {
    loading.value = false
  }
}

onMounted(loadCategories)
</script>
