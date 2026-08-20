<template>
  <AppShell active="list">
    <div class="space-y-4 animate-fade-up">
      <!-- Filtrlar -->
      <UCard>
        <div class="flex flex-wrap items-center gap-3">
          <UInput v-model="filters.from" type="date" icon="i-lucide-calendar" />
          <UInput v-model="filters.to" type="date" icon="i-lucide-calendar" />
          <USelectMenu v-model="filters.balanceType" :options="balanceOptions" value-attribute="value" option-attribute="label" class="w-36" />
          <USelectMenu v-model="filters.direction" :options="directionOptions" value-attribute="value" option-attribute="label" class="w-36" />
          <USelectMenu
            v-model="filters.categoryIds"
            :options="localizedCategories"
            value-attribute="_id"
            option-attribute="name"
            multiple
            :placeholder="t('categories')"
            class="w-44"
          >
            <template #label>
              <span v-if="!filters.categoryIds.length">{{ t('categories') }}</span>
              <span v-else>{{ filters.categoryIds.length }} {{ t('selected') }}</span>
            </template>
          </USelectMenu>
          <UInput v-model="search" icon="i-lucide-search" :placeholder="t('searchComment')" class="w-52" />
          <UButton icon="i-lucide-filter" color="ledger" @click="loadList">{{ t('filters') }}</UButton>
          <UButton v-if="hasActiveFilters" icon="i-lucide-x" color="gray" variant="ghost" @click="resetFilters">{{ t('clear') }}</UButton>
        </div>
      </UCard>

      <!-- Filtrlangan davr uchun qisqacha xulosa -->
      <div v-if="filteredTransactions.length" class="flex items-center justify-between px-1 text-sm">
        <p style="color: var(--ink-muted)">{{ filteredTransactions.length }} {{ t('transactions') }}</p>
        <p class="money font-semibold" :style="{ color: filteredNet >= 0 ? 'var(--income)' : 'var(--expense)' }">
          {{ filteredNet >= 0 ? '+' : '−' }}{{ formatMoney(Math.abs(filteredNet)) }}
        </p>
      </div>

      <!-- Ro'yxat -->
      <div class="space-y-2">
        <UCard v-for="tx in filteredTransactions" :key="tx._id" :ui="{ body: { padding: 'p-4 sm:p-5' } }">
          <div class="flex items-center justify-between cursor-pointer" @click="toggle(tx._id)">
            <div class="flex items-center gap-3">
              <span
                class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                :style="tx.direction === 'income'
                  ? { background: 'var(--brand-soft)', color: 'var(--income)' }
                  : { background: 'color-mix(in srgb, var(--expense) 10%, transparent)', color: 'var(--expense)' }"
              >
                <UIcon :name="tx.direction === 'income' ? 'i-lucide-arrow-up-right' : 'i-lucide-arrow-down-right'" class="w-5 h-5" />
              </span>
              <div>
                <p class="text-xs" style="color: var(--ink-muted)">{{ formatDate(tx.occurredAt) }}</p>
                <p class="text-sm font-medium">{{ categoryLabel(tx.category) || (tx.direction === 'income' ? t('income') : '-') }}</p>
              </div>
            </div>
            <p class="money text-lg font-semibold" :style="{ color: tx.direction === 'income' ? 'var(--income)' : 'var(--expense)' }">
              {{ tx.direction === 'income' ? '+' : '−' }}{{ formatMoney(tx.amount) }}
            </p>
          </div>

          <div v-if="expanded === tx._id" class="mt-4 pt-4 border-t grid grid-cols-2 gap-3 text-sm">
            <div>
              <p style="color: var(--ink-muted)">{{ t('paymentType') }}</p>
              <p class="font-medium">{{ tx.paymentType === 'cash' ? t('cash') : t('card') }}</p>
            </div>
            <div>
              <p style="color: var(--ink-muted)">{{ t('balance') }}</p>
              <p class="font-medium">{{ tx.balanceType === 'personal' ? t('personal') : t('company') }}</p>
            </div>
            <div v-if="tx.comment" class="col-span-2">
              <p style="color: var(--ink-muted)">{{ t('comment') }}</p>
              <p class="font-medium">{{ tx.comment }}</p>
            </div>
            <div class="col-span-2">
              <p class="mb-1" style="color: var(--ink-muted)">{{ t('receipt') }}</p>
              <img v-if="tx.receiptUrl" :src="apiOrigin + tx.receiptUrl" class="max-h-48 rounded-lg border" style="border-color: var(--line)" />
              <p v-else class="italic" style="color: var(--ink-muted)">{{ t('receiptMissing') }}</p>
            </div>
          </div>

          <button
            type="button"
            class="text-xs font-semibold mt-2.5"
            style="color: var(--brand-strong)"
            @click="toggle(tx._id)"
          >
            {{ expanded === tx._id ? t('close') : t('details') }}
          </button>
        </UCard>

        <div v-if="!filteredTransactions.length" class="text-center py-14" style="color: var(--ink-muted)">
          <UIcon name="i-lucide-receipt" class="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>{{ t('dataNotFound') }}</p>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { request } = useApi()
const { t, localeTag, formatMoney: localizedMoney, categoryLabel } = useI18n()
const config = useRuntimeConfig()
const apiOrigin = config.public.apiBase.replace('/api', '')

const balanceOptions = [
  { label: t('total'), value: '' },
  { label: t('personal'), value: 'personal' },
  { label: t('company'), value: 'company' },
]
const directionOptions = [
  { label: t('total'), value: '' },
  { label: t('income'), value: 'income' },
  { label: t('expense'), value: 'expense' },
]

function defaultFrom() {
  const d = new Date(); d.setDate(1)
  return d.toISOString().slice(0, 10)
}

const filters = reactive({
  from: defaultFrom(),
  to: new Date().toISOString().slice(0, 10),
  balanceType: '',
  direction: '',
  categoryIds: [] as string[],
})
const search = ref('')

const transactions = ref<any[]>([])
const categories = ref<any[]>([])
const localizedCategories = computed(() => categories.value.map((c) => ({ ...c, name: categoryLabel(c) })))
const expanded = ref<string | null>(null)

const hasActiveFilters = computed(() =>
  !!(filters.balanceType || filters.direction || filters.categoryIds.length || search.value),
)

function resetFilters() {
  filters.balanceType = ''
  filters.direction = ''
  filters.categoryIds = []
  search.value = ''
  loadList()
}

// Izoh bo'yicha qidiruv frontendda amalga oshiriladi (ro'yxat allaqachon davr/tur bo'yicha yuklangan)
const filteredTransactions = computed(() => {
  if (!search.value.trim()) return transactions.value
  const q = search.value.trim().toLowerCase()
  return transactions.value.filter((t) =>
    (t.comment || '').toLowerCase().includes(q) || (t.category?.name || '').toLowerCase().includes(q),
  )
})

const filteredNet = computed(() =>
  filteredTransactions.value.reduce((sum, t) => sum + (t.direction === 'income' ? t.amount : -t.amount), 0),
)

function toggle(id: string) {
  expanded.value = expanded.value === id ? null : id
}

function formatMoney(n: number) {
  return localizedMoney(n)
}
function formatDate(d: string) {
  return new Date(d).toLocaleString(localeTag.value)
}

async function loadCategories() {
  categories.value = await request('/categories')
}

async function loadList() {
  transactions.value = await request('/transactions', {
    query: {
      from: new Date(filters.from).toISOString(),
      to: new Date(filters.to + 'T23:59:59').toISOString(),
      balanceType: filters.balanceType || undefined,
      direction: filters.direction || undefined,
      categories: filters.categoryIds.length ? filters.categoryIds.join(',') : undefined,
    },
  })
}

onMounted(async () => {
  await Promise.all([loadCategories(), loadList()])
})
</script>
