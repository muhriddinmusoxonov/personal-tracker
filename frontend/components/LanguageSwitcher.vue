<template>
  <div class="flex items-center gap-1 rounded-xl p-1" style="background: var(--paper-alt)">
    <button v-for="item in languages" :key="item.value" type="button" class="px-2.5 py-1.5 rounded-lg text-xs font-bold transition" :style="locale === item.value ? activeStyle : mutedStyle" @click="setLocale(item.value)">
      {{ item.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { AppLocale } from '~/composables/useI18n'
const { locale, setLocale } = useI18n()
const languages: { value: AppLocale; label: string }[] = [
  { value: 'uz', label: 'UZ' },
  { value: 'ru', label: 'RU' },
  { value: 'en', label: 'EN' },
]
const activeStyle = { background: 'var(--paper)', color: 'var(--brand-strong)', boxShadow: '0 1px 2px rgba(22,33,28,0.08)' }
const mutedStyle = { color: 'var(--ink-muted)' }
</script>
