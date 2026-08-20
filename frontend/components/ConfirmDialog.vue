<template>
  <UModal :model-value="state.open" :ui="dropModalUi" @update:model-value="(v) => !v && respond(false)">
    <UCard>
      <div class="flex items-start gap-3.5">
        <span
          class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          :style="{ background: state.color === 'red' ? 'color-mix(in srgb, var(--expense) 12%, transparent)' : 'var(--brand-soft)' }"
        >
          <UIcon
            name="i-lucide-triangle-alert"
            class="w-5 h-5"
            :style="{ color: state.color === 'red' ? 'var(--expense)' : 'var(--brand-strong)' }"
          />
        </span>
        <div class="min-w-0">
          <h3 class="font-display font-semibold text-lg">{{ state.title }}</h3>
          <p v-if="state.description" class="text-sm mt-1" style="color: var(--ink-muted)">{{ state.description }}</p>
        </div>
      </div>

      <template #footer>
        <div class="grid grid-cols-2 gap-2.5">
          <UButton block color="gray" variant="soft" size="lg" @click="respond(false)">{{ state.cancelLabel }}</UButton>
          <UButton block :color="state.color" size="lg" @click="respond(true)">{{ state.confirmLabel }}</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const { state, respond } = useConfirm()

// So'rov oynasi uchun animatsiya: yuqoridan tomchidek tushadi (xira/blur holatda boshlanib,
// markazga kelganda aniqlashadi), orqa fon esa xiralashtiriladi (backdrop-blur) —
// bu butun ilovada barcha so'rov (confirm) oynalari uchun bir xil uslub.
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
</script>
