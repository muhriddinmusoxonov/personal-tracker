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
          <UButton icon="i-lucide-filter" color="ledger" @click="loadList">Filtrlash</UButton>
        </div>
      </UCard>

      <!-- Ro'yxat -->
      <div class="space-y-2">
        <UCard v-for="t in transactions" :key="t._id" :ui="{ body: { padding: 'p-4 sm:p-5' } }">
          <div class="flex items-center justify-between cursor-pointer" @click="toggle(t._id)">
            <div class="flex items-center gap-3">
              <span
                class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                :style="t.direction === 'income'
                  ? { background: 'var(--brand-soft)', color: 'var(--income)' }
                  : { background: 'color-mix(in srgb, var(--expense) 10%, transparent)', color: 'var(--expense)' }"
              >
                <UIcon :name="t.direction === 'income' ? 'i-lucide-arrow-up-right' : 'i-lucide-arrow-down-right'" class="w-5 h-5" />
              </span>
              <div>
                <p class="text-xs" style="color: var(--ink-muted)">{{ formatDate(t.occurredAt) }}</p>
                <p class="text-sm font-medium">{{ t.category?.name || (t.direction === 'income' ? 'Kirim' : '-') }}</p>
              </div>
            </div>
            <p class="money text-lg font-semibold" :style="{ color: t.direction === 'income' ? 'var(--income)' : 'var(--expense)' }">
              {{ t.direction === 'income' ? '+' : '−' }}{{ formatMoney(t.amount) }}
            </p>
          </div>

          <div v-if="expanded === t._id" class="mt-4 pt-4 border-t grid grid-cols-2 gap-3 text-sm">
            <div>
              <p style="color: var(--ink-muted)">To'lov turi</p>
              <p class="font-medium">{{ t.paymentType === 'cash' ? 'Naqd' : 'Karta' }}</p>
            </div>
            <div>
              <p style="color: var(--ink-muted)">Balance</p>
              <p class="font-medium">{{ t.balanceType === 'personal' ? 'Personal' : 'Company' }}</p>
            </div>
            <div v-if="t.comment" class="col-span-2">
              <p style="color: var(--ink-muted)">Izoh</p>
              <p class="font-medium">{{ t.comment }}</p>
            </div>
            <div class="col-span-2">
              <p class="mb-1" style="color: var(--ink-muted)">Chek</p>
              <img v-if="t.receiptUrl" :src="apiOrigin + t.receiptUrl" class="max-h-48 rounded-lg border" style="border-color: var(--line)" />
              <p v-else class="italic" style="color: var(--ink-muted)">Chek rasmi yuklanmagan</p>
            </div>
          </div>

          <button
            type="button"
            class="text-xs font-semibold mt-2.5"
            style="color: var(--brand-strong)"
            @click="toggle(t._id)"
          >
            {{ expanded === t._id ? 'Yopish' : 'Batafsil' }}
          </button>
        </UCard>

        <div v-if="!transactions.length" class="text-center py-14" style="color: var(--ink-muted)">
          <UIcon name="i-lucide-receipt" class="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Ma'lumot topilmadi</p>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { request } = useApi()
const config = useRuntimeConfig()
const apiOrigin = config.public.apiBase.replace('/api', '')

const balanceOptions = [
  { label: 'Umumiy', value: '' },
  { label: 'Personal', value: 'personal' },
  { label: 'Company', value: 'company' },
]
const directionOptions = [
  { label: 'Umumiy', value: '' },
  { label: 'Kirim', value: 'income' },
  { label: 'Chiqim', value: 'expense' },
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
})

const transactions = ref<any[]>([])
const expanded = ref<string | null>(null)

function toggle(id: string) {
  expanded.value = expanded.value === id ? null : id
}

function formatMoney(n: number) {
  return new Intl.NumberFormat('uz-UZ').format(n || 0) + " so'm"
}
function formatDate(d: string) {
  return new Date(d).toLocaleString('uz-UZ')
}

async function loadList() {
  transactions.value = await request('/transactions', {
    query: {
      from: new Date(filters.from).toISOString(),
      to: new Date(filters.to + 'T23:59:59').toISOString(),
      balanceType: filters.balanceType || undefined,
      direction: filters.direction || undefined,
    },
  })
}

onMounted(loadList)
</script>
