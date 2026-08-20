<template>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
const { t } = useI18n()
useHead(() => ({ title: `${t('appName')} — ${t('accounting')}` }))
</script>
