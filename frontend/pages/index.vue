<template>
  <div />
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
const auth = useAuthStore()
onMounted(() => {
  auth.restore()
  navigateTo(auth.token ? '/report' : '/login')
})
</script>
