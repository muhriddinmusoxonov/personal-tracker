<template>
  <div class="min-h-screen flex flex-col" style="background: var(--paper); color: var(--ink)">
    <!-- Header -->
    <header
      class="sticky top-0 z-40 border-b backdrop-blur supports-[backdrop-filter]:bg-opacity-70"
      :style="{ borderColor: 'var(--line)', background: 'var(--paper)' }"
    >
      <div class="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <span
            class="w-9 h-9 rounded-xl flex items-center justify-center font-display font-semibold text-lg shrink-0"
            style="background: var(--brand-soft); color: var(--brand-strong)"
          >₮</span>
          <div class="leading-tight">
            <p class="font-display font-semibold text-[17px]">Xarajatlarim</p>
            <p class="text-[11px] tracking-wide uppercase" style="color: var(--ink-muted)">Hisob-kitob</p>
          </div>
        </div>

        <!-- Desktop nav -->
        <nav class="desktop-nav hidden sm:flex items-center gap-1 segmented">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="px-3.5 py-1.5 text-sm font-semibold"
            :style="active === item.key
              ? { background: 'var(--paper-alt)', color: 'var(--brand-strong)', boxShadow: '0 1px 2px rgba(22,33,28,0.06)' }
              : { color: 'var(--ink-muted)' }"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-1.5">
          <UButton
            :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
            color="gray"
            variant="ghost"
            square
            aria-label="Ko'rinishni almashtirish"
            @click="toggleColorMode"
          />
          <UButton
            icon="i-heroicons-arrow-right-on-rectangle"
            color="gray"
            variant="ghost"
            square
            aria-label="Chiqish"
            @click="onLogout"
          />
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-8 pb-24 sm:pb-8">
      <slot />
    </main>

    <!-- Mobile bottom tab bar -->
    <nav
      class="mobile-tabbar sm:hidden fixed bottom-0 inset-x-0 z-40 border-t px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]"
      :style="{ background: 'var(--paper-alt)', borderColor: 'var(--line)' }"
    >
      <div class="flex items-center justify-around">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl text-[11px] font-semibold"
          :style="active === item.key ? { color: 'var(--brand-strong)' } : { color: 'var(--ink-muted)' }"
        >
          <UIcon :name="item.icon" class="w-5 h-5" />
          {{ item.label }}
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

defineProps<{ active?: string }>()

const auth = useAuthStore()
const router = useRouter()
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')
function toggleColorMode() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

const navItems = [
  { key: 'report', to: '/report', label: 'Hisobot', icon: 'i-lucide-pie-chart' },
  { key: 'add', to: '/add', label: "Qo'shish", icon: 'i-lucide-plus-circle' },
  { key: 'list', to: '/list', label: "Ro'yxat", icon: 'i-lucide-list' },
]

function onLogout() {
  auth.logout()
  router.push('/login')
}
</script>
