<template>
  <AppShell active="report">
    <div class="space-y-6 animate-fade-up">
      <!-- 1. Davr tanlash: kun / hafta / oy / yil -->
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div class="segmented">
          <button
            v-for="p in periods"
            :key="p.value"
            type="button"
            class="px-3.5 py-1.5 text-sm font-semibold"
            :style="period === p.value
              ? { background: 'var(--paper-alt)', color: 'var(--brand-strong)', boxShadow: '0 1px 2px rgba(22,33,28,0.06)' }
              : { color: 'var(--ink-muted)' }"
            @click="period = p.value"
          >
            {{ p.label }}
          </button>
        </div>

        <div class="flex items-center gap-3">
          <USelectMenu v-model="balanceType" :options="balanceOptions" value-attribute="value" option-attribute="label" class="w-40" />
          <UButton icon="i-lucide-download" color="gray" variant="soft" @click="exportModalOpen = true">
            Yuklab olish
          </UButton>
        </div>
      </div>

      <!-- 2. Balans — receipt-style signature card -->
      <div class="receipt px-6 pt-6 pb-5" style="box-shadow: 0 1px 2px rgba(22,33,28,0.05)">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-[11px] font-semibold tracking-wide uppercase" style="color: var(--ink-muted)">Joriy balans</p>
            <p class="money font-display text-3xl sm:text-4xl font-semibold mt-1.5" style="letter-spacing: -0.02em">
              {{ formatMoney(currentBalance) }}
            </p>
          </div>
          <span class="text-3xl opacity-70 font-display" style="color: var(--brand)">₮</span>
        </div>

        <div class="grid grid-cols-2 gap-3 mt-5">
          <div class="rounded-xl px-4 py-3" style="background: var(--brand-soft)">
            <p class="text-[11px] font-semibold tracking-wide uppercase" style="color: var(--income)">Kirim</p>
            <p class="money text-lg font-semibold mt-0.5" style="color: var(--income)">
              +{{ formatMoney(summary?.totalIncome || 0) }}
            </p>
          </div>
          <div class="rounded-xl px-4 py-3" style="background: color-mix(in srgb, var(--expense) 10%, transparent)">
            <p class="text-[11px] font-semibold tracking-wide uppercase" style="color: var(--expense)">Chiqim</p>
            <p class="money text-lg font-semibold mt-0.5" style="color: var(--expense)">
              −{{ formatMoney(summary?.totalExpense || 0) }}
            </p>
          </div>
        </div>

        <div class="barcode-strip mt-5" style="color: var(--ink-muted)" />
      </div>

      <!-- 3. Category diagramma -->
      <UCard>
        <template #header>
          <h2 class="font-display font-semibold text-lg">Kategoriyalar bo'yicha chiqimlar</h2>
        </template>
        <div v-if="summary?.byCategory?.length" class="max-w-md mx-auto">
          <Doughnut :data="chartData" :options="chartOptions" />
        </div>
        <div v-else class="text-center py-10" style="color: var(--ink-muted)">
          <UIcon name="i-lucide-pie-chart" class="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Bu davrda chiqimlar mavjud emas</p>
        </div>
      </UCard>
    </div>

    <!-- Yuklab olish modali -->
    <UModal v-model="exportModalOpen">
      <UCard>
        <template #header>
          <h3 class="font-display font-semibold text-lg">Hisobotni yuklab olish (Excel)</h3>
        </template>

        <div class="space-y-5">
          <div>
            <p class="text-[11px] font-semibold tracking-wide uppercase mb-2" style="color: var(--ink-muted)">Davr</p>
            <div class="segmented">
              <button
                v-for="p in periods" :key="p.value" type="button"
                class="px-3 py-1.5 text-xs font-semibold"
                :style="exportPeriod === p.value
                  ? { background: 'var(--paper-alt)', color: 'var(--brand-strong)' }
                  : { color: 'var(--ink-muted)' }"
                @click="exportPeriod = p.value"
              >{{ p.label }}</button>
            </div>
          </div>

          <div>
            <p class="text-[11px] font-semibold tracking-wide uppercase mb-2" style="color: var(--ink-muted)">Balance</p>
            <div class="flex gap-4">
              <UCheckbox v-model="exportFilters.personal" label="Personal" />
              <UCheckbox v-model="exportFilters.company" label="Company" />
            </div>
          </div>

          <div>
            <p class="text-[11px] font-semibold tracking-wide uppercase mb-2" style="color: var(--ink-muted)">Turi</p>
            <div class="flex gap-4">
              <UCheckbox v-model="exportFilters.income" label="Kirim" />
              <UCheckbox v-model="exportFilters.expense" label="Chiqim" />
            </div>
          </div>

          <div>
            <p class="text-[11px] font-semibold tracking-wide uppercase mb-2" style="color: var(--ink-muted)">Kategoriyalar</p>
            <div class="flex flex-wrap gap-x-4 gap-y-2">
              <UCheckbox v-for="c in categories" :key="c.id" v-model="exportFilters.categoryIds" :value="c._id" :label="c.name" />
            </div>
          </div>
        </div>

        <template #footer>
          <UButton block icon="i-lucide-download" color="ledger" size="lg" @click="doExport" :loading="exporting">
            Excel faylni yuklab olish
          </UButton>
        </template>
      </UCard>
    </UModal>
  </AppShell>
</template>

<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useAuthStore } from '~/stores/auth'
ChartJS.register(ArcElement, Tooltip, Legend)

definePageMeta({ middleware: 'auth' })

const { request } = useApi()
const auth = useAuthStore()
const config = useRuntimeConfig()

const periods = [
  { label: 'Kun', value: 'day' },
  { label: 'Hafta', value: 'week' },
  { label: 'Oy', value: 'month' },
  { label: 'Yil', value: 'year' },
]
const balanceOptions = [
  { label: 'Umumiy', value: '' },
  { label: 'Personal', value: 'personal' },
  { label: 'Company', value: 'company' },
]

const period = ref('month')
const balanceType = ref('')
const summary = ref<any>(null)
const balance = ref<any>(null)
const categories = ref<any[]>([])

const exportModalOpen = ref(false)
const exportPeriod = ref('month')
const exporting = ref(false)
const exportFilters = reactive({
  personal: true,
  company: true,
  income: true,
  expense: true,
  categoryIds: [] as string[],
})

function periodRange(p: string) {
  const now = new Date()
  const from = new Date(now)
  if (p === 'day') from.setHours(0, 0, 0, 0)
  else if (p === 'week') { from.setDate(now.getDate() - now.getDay()); from.setHours(0, 0, 0, 0) }
  else if (p === 'month') { from.setDate(1); from.setHours(0, 0, 0, 0) }
  else if (p === 'year') { from.setMonth(0, 1); from.setHours(0, 0, 0, 0) }
  return { from: from.toISOString(), to: now.toISOString() }
}

async function loadSummary() {
  const { from, to } = periodRange(period.value)
  summary.value = await request('/reports/summary', {
    query: { from, to, balanceType: balanceType.value || undefined },
  })
}

async function loadBalance() {
  balance.value = await request('/balances')
}

async function loadCategories() {
  categories.value = await request('/categories')
}

const currentBalance = computed(() => {
  if (!balance.value) return 0
  if (balanceType.value === 'personal') return balance.value.personal.total
  if (balanceType.value === 'company') return balance.value.company.total
  return balance.value.grandTotal
})

const chartColors = ['#0E7A5F', '#46AC81', '#B8892B', '#C1462F', '#5C6B62', '#74C7A2', '#0B5F49', '#A6DDC3']
const chartData = computed(() => ({
  labels: (summary.value?.byCategory || []).map((c: any) => c.name),
  datasets: [
    {
      data: (summary.value?.byCategory || []).map((c: any) => c.total),
      backgroundColor: chartColors,
      borderWidth: 0,
    },
  ],
}))
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { font: { family: "'Public Sans'" }, usePointStyle: true, boxWidth: 8 },
    },
  },
}

function formatMoney(n: number) {
  return new Intl.NumberFormat('uz-UZ').format(n || 0) + " so'm"
}

async function doExport() {
  exporting.value = true
  try {
    const { from, to } = periodRange(exportPeriod.value)
    const params = new URLSearchParams()
    params.set('from', from)
    params.set('to', to)
    if (exportFilters.personal && !exportFilters.company) params.set('balanceType', 'personal')
    if (exportFilters.company && !exportFilters.personal) params.set('balanceType', 'company')
    if (exportFilters.income && !exportFilters.expense) params.set('direction', 'income')
    if (exportFilters.expense && !exportFilters.income) params.set('direction', 'expense')
    if (exportFilters.categoryIds.length) params.set('categories', exportFilters.categoryIds.join(','))

    const res = await fetch(`${config.public.apiBase}/reports/export?${params.toString()}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hisobot-${Date.now()}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)
    exportModalOpen.value = false
  } finally {
    exporting.value = false
  }
}

watch([period, balanceType], loadSummary)

onMounted(async () => {
  await Promise.all([loadSummary(), loadBalance(), loadCategories()])
})
</script>
