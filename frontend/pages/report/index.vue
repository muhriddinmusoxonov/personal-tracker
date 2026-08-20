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
            @click="changePeriod(p.value)"
          >
            {{ p.label }}
          </button>
        </div>

        <div class="flex items-center gap-3">
          <USelectMenu v-model="balanceType" :options="balanceOptions" value-attribute="value" option-attribute="label" class="w-40" />
          <UButton icon="i-lucide-download" color="gray" variant="soft" @click="exportModalOpen = true">
            {{ t('download') }}
          </UButton>
        </div>
      </div>

      <!-- 1b. Tanlangan davr bo'yicha oldinga/orqaga o'tish -->
      <div class="flex items-center justify-center gap-2">
        <UButton icon="i-lucide-chevron-left" color="gray" variant="soft" square @click="shiftPeriod(-1)" />
        <p class="font-display font-semibold text-lg min-w-[200px] text-center capitalize">{{ periodLabel }}</p>
        <UButton icon="i-lucide-chevron-right" color="gray" variant="soft" square @click="shiftPeriod(1)" />
      </div>

      <!-- 2. Balans — receipt-style signature card -->
      <div class="receipt px-6 pt-6 pb-5" style="box-shadow: 0 1px 2px rgba(22,33,28,0.05)">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-[11px] font-semibold tracking-wide uppercase" style="color: var(--ink-muted)">{{ t('currentBalance') }}</p>
            <p class="money font-display text-3xl sm:text-4xl font-semibold mt-1.5" style="letter-spacing: -0.02em">
              {{ formatMoney(currentBalance) }}
            </p>
          </div>
          <span class="text-3xl opacity-70 font-display" style="color: var(--brand)">₮</span>
        </div>

        <div class="grid grid-cols-2 gap-3 mt-5">
          <div class="rounded-xl px-4 py-3" style="background: var(--brand-soft)">
            <p class="text-[11px] font-semibold tracking-wide uppercase" style="color: var(--income)">{{ t('income') }}</p>
            <p class="money text-lg font-semibold mt-0.5" style="color: var(--income)">
              +{{ formatMoney(summary?.totalIncome || 0) }}
            </p>
          </div>
          <div class="rounded-xl px-4 py-3" style="background: color-mix(in srgb, var(--expense) 10%, transparent)">
            <p class="text-[11px] font-semibold tracking-wide uppercase" style="color: var(--expense)">{{ t('expense') }}</p>
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
          <h2 class="font-display font-semibold text-lg">{{ t('categoryExpenses') }}</h2>
        </template>
        <div v-if="summary?.byCategory?.length" class="max-w-md mx-auto relative">
          <Doughnut :data="chartData" :options="chartOptions" />
          <div
            v-for="(c, i) in summary.byCategory"
            :key="c.name"
            class="absolute flex items-center justify-center rounded-full pointer-events-none"
            :style="categoryIconStyle(i)"
          >
            <UIcon :name="`i-lucide-${c.icon}`" class="w-4 h-4 sm:w-5 sm:h-5" style="color: #fff; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.45))" />
          </div>
        </div>
        <div v-else class="text-center py-10" style="color: var(--ink-muted)">
          <UIcon name="i-lucide-pie-chart" class="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>{{ t('noExpensesPeriod') }}</p>
        </div>
      </UCard>

      <!-- 4. Joriy oy byudjetlari — qisqacha -->
      <UCard v-if="budgets.length">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-display font-semibold text-lg">{{ t('budgetsThisMonth') }}</h2>
            <NuxtLink to="/budgets" class="text-sm font-semibold flex items-center gap-1" style="color: var(--brand-strong)">
              Barchasi <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
            </NuxtLink>
          </div>
        </template>
        <div class="space-y-4">
          <div v-for="b in budgets.slice(0, 4)" :key="b._id">
            <div class="flex items-center justify-between text-sm mb-1.5">
              <span class="font-medium">{{ b.category ? categoryLabel(b.category) : t('overall') + ' ' + t('budget') }}</span>
              <span class="money" :style="{ color: b.overspent ? 'var(--expense)' : 'var(--ink-muted)' }">
                {{ formatMoney(b.spent) }} / {{ formatMoney(b.amount) }}
              </span>
            </div>
            <div class="progress-track">
              <div
                class="progress-fill"
                :style="{ width: `${b.percent}%`, background: b.overspent ? 'var(--expense)' : (b.percent >= 80 ? 'var(--gold)' : 'var(--brand)') }"
              />
            </div>
          </div>
        </div>
      </UCard>
      <UCard v-else class="text-center">
        <UIcon name="i-lucide-piggy-bank" class="w-7 h-7 mx-auto mb-2 opacity-50" style="color: var(--ink-muted)" />
        <p class="text-sm mb-3" style="color: var(--ink-muted)">{{ t('noBudget') }}</p>
        <NuxtLink to="/budgets">
          <UButton size="sm" color="ledger" icon="i-lucide-plus">{{ t('addBudget') }}</UButton>
        </NuxtLink>
      </UCard>
    </div>

    <!-- {{ t('download') }} modali: tomchiga o'xshab yuqoridan tushib, o'rtaga kelganda aniq (blur'siz) ko'rinadi;
         orqadagi sahifa esa xira (blur) qilinadi, shu bilan e'tibor to'liq so'rov oynasiga qaratiladi -->
    <UModal v-model="exportModalOpen" :ui="dropModalUi">
      <UCard>
        <template #header>
          <h3 class="font-display font-semibold text-lg">{{ t('exportReport') }}</h3>
        </template>

        <div class="space-y-5">
          <div>
            <p class="text-[11px] font-semibold tracking-wide uppercase mb-2" style="color: var(--ink-muted)">{{ t('period') }}</p>
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
            <p class="text-[11px] font-semibold tracking-wide uppercase mb-2" style="color: var(--ink-muted)">{{ t('balance') }}</p>
            <div class="flex gap-4">
              <UCheckbox v-model="exportFilters.personal" :label="t('personal')" />
              <UCheckbox v-model="exportFilters.company" :label="t('company')" />
            </div>
          </div>

          <div>
            <p class="text-[11px] font-semibold tracking-wide uppercase mb-2" style="color: var(--ink-muted)">{{ t('type') }}</p>
            <div class="flex gap-4">
              <UCheckbox v-model="exportFilters.income" :label="t('income')" />
              <UCheckbox v-model="exportFilters.expense" :label="t('expense')" />
            </div>
          </div>

          <div>
            <p class="text-[11px] font-semibold tracking-wide uppercase mb-2" style="color: var(--ink-muted)">{{ t('categories') }}</p>
            <div class="flex flex-wrap gap-x-4 gap-y-2">
              <UCheckbox v-for="c in categories" :key="c.id" v-model="exportFilters.categoryIds" :value="c._id" :label="categoryLabel(c)" />
            </div>
          </div>
        </div>

        <template #footer>
          <UButton block icon="i-lucide-download" color="ledger" size="lg" @click="doExport" :loading="exporting">
            {{ t('downloadExcel') }}
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
const { t, localeTag, formatMoney: localizedMoney, categoryLabel } = useI18n()
const auth = useAuthStore()
const config = useRuntimeConfig()

const periods = computed(() => [
  { label: t('day'), value: 'day' }, { label: t('week'), value: 'week' }, { label: t('month'), value: 'month' }, { label: t('year'), value: 'year' },
])
const balanceOptions = computed(() => [
  { label: t('total'), value: '' }, { label: t('personal'), value: 'personal' }, { label: t('company'), value: 'company' },
])

const period = ref('month')
const refDate = ref(new Date())
const balanceType = ref('')
const summary = ref<any>(null)
const balance = ref<any>(null)
const categories = ref<any[]>([])
const budgets = ref<any[]>([])

const exportModalOpen = ref(false)

// So'rov oynasi uchun maxsus animatsiya: yuqoridan tomchidek tushadi (uzoqdan xira/blur holatda boshlanib,
// pastga kelib markazda joylashganda aniqlashadi) va orqa fon (overlay) xiralashtiriladi (backdrop-blur)
const dropModalUi = {
  overlay: {
    background: 'bg-black/30 dark:bg-black/50 backdrop-blur-sm',
  },
  transition: {
    enter: 'ease-[cubic-bezier(0.22,1,0.36,1)] duration-500',
    enterFrom: 'opacity-0 -translate-y-40 scale-90 blur-md',
    enterTo: 'opacity-100 translate-y-0 scale-100 blur-none',
    leave: 'ease-in duration-200',
    leaveFrom: 'opacity-100 translate-y-0 scale-100 blur-none',
    leaveTo: 'opacity-0 -translate-y-10 scale-95 blur-sm',
  },
}
const exportPeriod = ref('month')
const exporting = ref(false)
const exportFilters = reactive({
  personal: true,
  company: true,
  income: true,
  expense: true,
  categoryIds: [] as string[],
})

// Berilgan davr turi (kun/hafta/oy/yil) va tanlangan sana asosida aniq from/to hisoblaydi.
// Har doim to'liq davr (masalan butun oy) qaytariladi — "hozirgi vaqt"ga bog'liq emas,
// shu tufayli orqaga/oldinga o'tilganda ham davr chegaralari to'g'ri bo'ladi.
function periodRange(p: string, baseDate: Date) {
  const Y = baseDate.getFullYear()
  const M = baseDate.getMonth()
  const D = baseDate.getDate()

  let from: Date
  let to: Date

  if (p === 'day') {
    from = new Date(Y, M, D, 0, 0, 0, 0)
    to = new Date(Y, M, D, 23, 59, 59, 999)
  } else if (p === 'week') {
    const dow = baseDate.getDay()
    from = new Date(Y, M, D - dow, 0, 0, 0, 0)
    to = new Date(Y, M, D - dow + 6, 23, 59, 59, 999)
  } else if (p === 'month') {
    from = new Date(Y, M, 1, 0, 0, 0, 0)
    to = new Date(Y, M + 1, 0, 23, 59, 59, 999)
  } else {
    from = new Date(Y, 0, 1, 0, 0, 0, 0)
    to = new Date(Y, 11, 31, 23, 59, 59, 999)
  }
  return { from: from.toISOString(), to: to.toISOString() }
}

// Bu yerda Intl.toLocaleString o'rniga qo'lda formatlanadi — ba'zi muhitlarda
// 'uz-UZ' uchun oy nomlari to'g'ri chiqmasligi mumkin (masalan "M08").
const monthKeys = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
function pad2(n: number) {
  return String(n).padStart(2, '0')
}

const periodLabel = computed(() => {
  const d = refDate.value
  const Y = d.getFullYear(), M = d.getMonth(), D = d.getDate()

  if (period.value === 'day') {
    return `${Y}.${pad2(M + 1)}.${D}`
  }
  if (period.value === 'week') {
    const dow = d.getDay()
    const start = new Date(Y, M, D - dow)
    const end = new Date(Y, M, D - dow + 6)
    const startLabel = `${start.getDate()}.${pad2(start.getMonth() + 1)}`
    const endLabel = `${end.getDate()}.${pad2(end.getMonth() + 1)}.${end.getFullYear()}`
    return `${startLabel} – ${endLabel}`
  }
  if (period.value === 'month') {
    return `${t(monthKeys[M])} ${Y}`
  }
  return String(Y)
})

// Davr turini almashtirish: joriy sanaga qaytariladi (bugungi kun / shu hafta / shu oy / shu yil)
function changePeriod(p: string) {
  period.value = p
  refDate.value = new Date()
  loadSummary()
}

// Tanlangan davr turi bo'yicha oldinga (+1) yoki orqaga (-1) o'tish
function shiftPeriod(delta: number) {
  const d = new Date(refDate.value)
  if (period.value === 'day') d.setDate(d.getDate() + delta)
  else if (period.value === 'week') d.setDate(d.getDate() + delta * 7)
  else if (period.value === 'month') d.setMonth(d.getMonth() + delta)
  else d.setFullYear(d.getFullYear() + delta)
  refDate.value = d
}

async function loadSummary() {
  const { from, to } = periodRange(period.value, refDate.value)
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

async function loadBudgets() {
  const month = new Date().toISOString().slice(0, 7)
  budgets.value = await request('/budgets', { query: { month } })
}

const currentBalance = computed(() => {
  if (!balance.value) return 0
  if (balanceType.value === 'personal') return balance.value.personal.total
  if (balanceType.value === 'company') return balance.value.company.total
  return balance.value.grandTotal
})

const chartColors = ['#0E7A5F', '#46AC81', '#B8892B', '#C1462F', '#5C6B62', '#74C7A2', '#0B5F49', '#A6DDC3']
const chartData = computed(() => ({
  labels: (summary.value?.byCategory || []).map((c: any) => categoryLabel(c)),
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
  // Har doim yuqoridan (soat 12) boshlab, soat mili yo'nalishida chizamiz —
  // shunda category ikonkalarini joylashtirish uchun burchak hisob-kitobi barqaror bo'ladi.
  rotation: -90,
  circumference: 360,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { font: { family: "'Public Sans'" }, usePointStyle: true, boxWidth: 8 },
    },
  },
}

// Har bir category segmentining o'rtasiga (halqaning taxminan markaziga) ikonkani joylashtirish uchun
// burchakni hisoblaydi va foizli (top/left) koordinataga aylantiradi. Diagramma har doim kvadrat
// (aspectRatio 1) bo'lgani uchun foizli joylashtiruv turli ekran o'lchamlarida ham to'g'ri ishlaydi.
function categoryIconStyle(index: number) {
  const items = summary.value?.byCategory || []
  const total = items.reduce((s: number, c: any) => s + c.total, 0) || 1

  let before = 0
  for (let i = 0; i < index; i++) before += items[i].total
  const value = items[index].total

  const startDeg = -90 + (before / total) * 360
  const sweepDeg = (value / total) * 360
  const midDeg = startDeg + sweepDeg / 2
  const midRad = (midDeg * Math.PI) / 180

  // Halqa (ring) taxminan 50%–100% radius oralig'ida, shuning uchun ikonka ~75% radiusga joylashadi
  const R = 0.75
  const leftPct = 50 + Math.cos(midRad) * R * 50
  const topPct = 50 + Math.sin(midRad) * R * 50

  // Juda kichik (taxminan 4% dan kam) bo'lakларда ikonka sig'may qolishi mumkin — shunday hollarda yashiramiz
  const visible = sweepDeg >= 14

  return {
    left: `${leftPct}%`,
    top: `${topPct}%`,
    transform: 'translate(-50%, -50%)',
    opacity: visible ? 1 : 0,
  }
}

function formatMoney(n: number) {
  return localizedMoney(n)
}

async function doExport() {
  exporting.value = true
  try {
    const { from, to } = periodRange(exportPeriod.value, new Date())
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

watch([balanceType, refDate], loadSummary)

onMounted(async () => {
  await Promise.all([loadSummary(), loadBalance(), loadCategories(), loadBudgets()])
})
</script>
