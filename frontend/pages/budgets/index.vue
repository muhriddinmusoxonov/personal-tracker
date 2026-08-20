<template>
  <AppShell active="budgets">
    <div class="space-y-5 animate-fade-up">
      <!-- Oy tanlash -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UButton icon="i-lucide-chevron-left" color="gray" variant="soft" square @click="shiftMonth(-1)" />
          <p class="font-display font-semibold text-lg w-40 text-center">{{ monthLabel }}</p>
          <UButton icon="i-lucide-chevron-right" color="gray" variant="soft" square @click="shiftMonth(1)" />
        </div>
        <UButton icon="i-lucide-plus" color="ledger" @click="openCreate">{{ t('budget') }}</UButton>
      </div>

      <!-- Umumiy holat -->
      <div v-if="budgets.length" class="receipt px-6 pt-6 pb-5" style="box-shadow: 0 1px 2px rgba(22,33,28,0.05)">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-[11px] font-semibold tracking-wide uppercase" style="color: var(--ink-muted)">{{ t('totalSpent') }}</p>
            <p class="money font-display text-3xl sm:text-4xl font-semibold mt-1.5" style="letter-spacing: -0.02em">
              {{ formatMoney(totalSpent) }}
            </p>
            <p class="text-sm mt-1" style="color: var(--ink-muted)">
              {{ totalAmount ? `${totalPercent}% / ${formatMoney(totalAmount)} ${t('limit')}` : '' }}
            </p>
          </div>
          <span class="text-3xl opacity-70 font-display" style="color: var(--brand)">
            <UIcon name="i-lucide-piggy-bank" class="w-8 h-8" />
          </span>
        </div>
        <div class="progress-track mt-5">
          <div class="progress-fill" :style="{ width: `${totalPercent}%`, background: totalOverspent ? 'var(--expense)' : 'var(--brand)' }" />
        </div>
        <div class="barcode-strip mt-5" style="color: var(--ink-muted)" />
      </div>

      <!-- Byudjetlar ro'yxati -->
      <div v-if="budgets.length" class="space-y-3">
        <UCard v-for="b in budgets" :key="b._id" :ui="{ body: { padding: 'p-4 sm:p-5' } }">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <span
                class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style="background: var(--brand-soft); color: var(--brand-strong)"
              >
                <UIcon :name="b.category ? `i-lucide-${b.category.icon}` : 'i-lucide-layers'" class="w-5 h-5" />
              </span>
              <div class="min-w-0">
                <p class="text-sm font-semibold truncate">{{ b.category ? categoryLabel(b.category) : t('overall') + ' ' + t('budget') }}</p>
                <p class="text-xs" style="color: var(--ink-muted)">{{ scopeLabel(b.balanceType) }}</p>
              </div>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <UButton icon="i-lucide-pencil" color="gray" variant="ghost" square size="xs" @click="openEdit(b)" />
              <UButton icon="i-lucide-trash-2" color="red" variant="ghost" square size="xs" @click="confirmDelete(b)" />
            </div>
          </div>

          <div class="mt-4">
            <div class="flex items-baseline justify-between text-sm mb-1.5">
              <span class="money font-semibold" :style="{ color: b.overspent ? 'var(--expense)' : 'var(--ink)' }">
                {{ formatMoney(b.spent) }}
              </span>
              <span class="money" style="color: var(--ink-muted)">/ {{ formatMoney(b.amount) }}</span>
            </div>
            <div class="progress-track">
              <div
                class="progress-fill"
                :style="{ width: `${b.percent}%`, background: progressColor(b) }"
              />
            </div>
            <p class="text-xs mt-1.5" :style="{ color: b.overspent ? 'var(--expense)' : 'var(--ink-muted)' }">
              {{ b.overspent
                ? `${formatMoney(b.spent - b.amount)} limitdan oshdi`
                : `${formatMoney(b.remaining)} qoldi` }}
            </p>
          </div>
        </UCard>
      </div>

      <div v-else class="text-center py-16" style="color: var(--ink-muted)">
        <UIcon name="i-lucide-piggy-bank" class="w-9 h-9 mx-auto mb-3 opacity-50" />
        <p class="font-medium mb-1">{{ t('budgetExistsNone') }}</p>
        <p class="text-sm mb-4">{{ t('monthlyLimitHint') }}</p>
        <UButton icon="i-lucide-plus" color="ledger" @click="openCreate">{{ t('firstBudget') }}</UButton>
      </div>
    </div>

    <!-- Yaratish / tahrirlash modali -->
    <UModal v-model="modalOpen">
      <UCard>
        <template #header>
          <h3 class="font-display font-semibold text-lg">{{ editingId ? t('editBudget') : t('newBudget') }}</h3>
        </template>

        <div class="space-y-5">
          <UFormGroup :label="t('type')">
            <div class="segmented w-full">
              <button
                type="button" class="flex-1 px-3.5 py-2 text-sm font-semibold"
                :style="form.scope === 'overall' ? activeStyle : mutedStyle"
                @click="form.scope = 'overall'"
              >{{ t('overall') }}</button>
              <button
                type="button" class="flex-1 px-3.5 py-2 text-sm font-semibold"
                :style="form.scope === 'category' ? activeStyle : mutedStyle"
                @click="form.scope = 'category'"
              >{{ t('byCategory') }}</button>
            </div>
          </UFormGroup>

          <UFormGroup v-if="form.scope === 'category'" :label="t('category')">
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <button
                v-for="c in expenseCategories"
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

          <UFormGroup :label="t('balance')">
            <div class="segmented w-full">
              <button
                type="button" class="flex-1 px-3 py-2 text-sm font-semibold"
                :style="form.balanceType === '' ? activeStyle : mutedStyle"
                @click="form.balanceType = ''"
              >{{ t('allBalances') }}</button>
              <button
                type="button" class="flex-1 px-3 py-2 text-sm font-semibold"
                :style="form.balanceType === 'personal' ? activeStyle : mutedStyle"
                @click="form.balanceType = 'personal'"
              >{{ t('personal') }}</button>
              <button
                type="button" class="flex-1 px-3 py-2 text-sm font-semibold"
                :style="form.balanceType === 'company' ? activeStyle : mutedStyle"
                @click="form.balanceType = 'company'"
              >{{ t('company') }}</button>
            </div>
          </UFormGroup>

          <UFormGroup :label="t('monthlyLimit')">
            <UInput v-model="form.amount" type="number" placeholder="masalan: 1500000" icon="i-lucide-banknote" class="money" />
          </UFormGroup>

          <UAlert v-if="formError" color="red" variant="soft" :title="formError" icon="i-lucide-alert-circle" />
        </div>

        <template #footer>
          <UButton block size="lg" color="ledger" :loading="saving" @click="save">{{ t('save') }}</UButton>
        </template>
      </UCard>
    </UModal>
  </AppShell>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { request } = useApi()
const { t, formatMoney: localizedMoney, categoryLabel } = useI18n()

const budgets = ref<any[]>([])
const categories = ref<any[]>([])
const monthDate = ref(new Date())

const modalOpen = ref(false)
const editingId = ref<string | null>(null)
const saving = ref(false)
const formError = ref('')

const activeStyle = { background: 'var(--paper-alt)', color: 'var(--brand-strong)', boxShadow: '0 1px 2px rgba(22,33,28,0.06)' }
const mutedStyle = { color: 'var(--ink-muted)' }

const form = reactive({
  scope: 'overall' as 'overall' | 'category',
  category: '',
  balanceType: '' as '' | 'personal' | 'company',
  amount: '',
})

const expenseCategories = computed(() => categories.value.filter((c) => c.type !== 'income'))

const monthKey = computed(() => {
  const y = monthDate.value.getFullYear()
  const m = String(monthDate.value.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
})
const monthKeys = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
const monthLabel = computed(() =>
  `${t(monthKeys[monthDate.value.getMonth()])} ${monthDate.value.getFullYear()}`,
)

function shiftMonth(delta: number) {
  const d = new Date(monthDate.value)
  d.setDate(1)
  d.setMonth(d.getMonth() + delta)
  monthDate.value = d
  loadBudgets()
}

const totalSpent = computed(() => budgets.value.reduce((s, b) => s + b.spent, 0))
const totalAmount = computed(() => budgets.value.reduce((s, b) => s + b.amount, 0))
const totalPercent = computed(() => (totalAmount.value ? Math.min(100, Math.round((totalSpent.value / totalAmount.value) * 100)) : 0))
const totalOverspent = computed(() => totalSpent.value > totalAmount.value)

function progressColor(b: any) {
  if (b.overspent) return 'var(--expense)'
  if (b.percent >= 80) return 'var(--gold)'
  return 'var(--brand)'
}

function scopeLabel(balanceType: string | null) {
  if (balanceType === 'personal') return t('personal')
  if (balanceType === 'company') return t('company')
  return t('allBalances')
}

function formatMoney(n: number) {
  return localizedMoney(n)
}

async function loadBudgets() {
  budgets.value = await request('/budgets', { query: { month: monthKey.value } })
}
async function loadCategories() {
  categories.value = await request('/categories', { query: { type: 'expense' } })
}

function openCreate() {
  editingId.value = null
  formError.value = ''
  form.scope = 'overall'
  form.category = ''
  form.balanceType = ''
  form.amount = ''
  modalOpen.value = true
}

function openEdit(b: any) {
  editingId.value = b._id
  formError.value = ''
  form.scope = b.category ? 'category' : 'overall'
  form.category = b.category?._id || ''
  form.balanceType = b.balanceType || ''
  form.amount = String(b.amount)
  modalOpen.value = true
}

const { confirm } = useConfirm()

async function confirmDelete(b: any) {
  const ok = await confirm({
    title: `${b.category ? b.category.name : 'Umumiy'} byudjetini o'chirmoqchimisiz?`,
    description: "Bu amalni ortga qaytarib bo'lmaydi.",
  })
  if (!ok) return
  await request(`/budgets/${b._id}`, { method: 'DELETE' })
  await loadBudgets()
}

async function save() {
  formError.value = ''
  if (form.scope === 'category' && !form.category) {
    formError.value = 'Kategoriyani tanlang'
    return
  }
  const amountNum = Number(form.amount)
  if (!amountNum || amountNum <= 0) {
    formError.value = "Limit summasini to'g'ri kiriting"
    return
  }

  saving.value = true
  try {
    const body = {
      category: form.scope === 'category' ? form.category : '',
      balanceType: form.balanceType || '',
      amount: amountNum,
    }
    if (editingId.value) {
      await request(`/budgets/${editingId.value}`, { method: 'PATCH', body })
    } else {
      await request('/budgets', { method: 'POST', body })
    }
    modalOpen.value = false
    await loadBudgets()
  } catch (e: any) {
    formError.value = e?.data?.message || 'Xatolik yuz berdi'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadCategories(), loadBudgets()])
})
</script>
