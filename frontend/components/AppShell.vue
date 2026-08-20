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
            <p class="font-display font-semibold text-[17px]">{{ t('appName') }}</p>
            <p class="text-[11px] tracking-wide uppercase" style="color: var(--ink-muted)">{{ t('accounting') }}</p>
          </div>
        </div>

        <LanguageSwitcher class="mx-2" />

        <!-- Desktop nav -->
        <nav class="desktop-nav hidden sm:flex items-center gap-1 segmented">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="px-3.5 py-1.5 text-sm font-semibold flex items-center gap-1.5"
            :style="active === item.key
              ? { background: 'var(--paper-alt)', color: 'var(--brand-strong)', boxShadow: '0 1px 2px rgba(22,33,28,0.06)' }
              : { color: 'var(--ink-muted)' }"
          >
            <UIcon :name="item.icon" class="w-4 h-4" />
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-8 pb-24 sm:pb-8">
      <slot />
    </main>

    <!-- Mobile bottom tab bar -->
    <nav
      class="mobile-tabbar sm:hidden fixed bottom-0 inset-x-0 z-40 border-t px-1 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]"
      :style="{ background: 'var(--paper-alt)', borderColor: 'var(--line)' }"
    >
      <div class="flex items-center justify-around">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10.5px] font-semibold"
          :style="active === item.key ? { color: 'var(--brand-strong)' } : { color: 'var(--ink-muted)' }"
        >
          <UIcon :name="item.icon" class="w-5 h-5" />
          {{ item.label }}
        </NuxtLink>
      </div>
    </nav>

    <!-- Butun ilova bo'ylab ishlatiladigan so'rov (confirm) oynasi -->
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
defineProps<{ active?: string }>()

const { t } = useI18n()
const navItems = computed(() => [
  { key: 'report', to: '/report', label: t('analysis'), icon: 'i-lucide-pie-chart' },
  { key: 'list', to: '/list', label: t('list'), icon: 'i-lucide-list' },
  { key: 'add', to: '/add', label: t('add'), icon: 'i-lucide-circle-plus' },
  { key: 'budgets', to: '/budgets', label: t('budget'), icon: 'i-lucide-piggy-bank' },
  { key: 'settings', to: '/settings', label: t('settings'), icon: 'i-lucide-settings' },
])
</script>
