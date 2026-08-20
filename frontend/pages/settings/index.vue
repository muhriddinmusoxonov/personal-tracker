<template>
  <AppShell active="settings">
    <div class="space-y-5 animate-fade-up max-w-2xl mx-auto">
      <h1 class="font-display font-semibold text-2xl">{{ t('settings') }}</h1>

      <Transition name="fade">
        <UAlert v-if="successMessage" color="green" variant="soft" icon="i-lucide-check-circle-2" :title="successMessage" />
      </Transition>

      <UCard>
        <template #header><h2 class="font-display font-semibold text-lg">{{ t('profile') }}</h2></template>
        <div class="flex items-center gap-4">
          <span class="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-semibold text-xl shrink-0" style="background: var(--brand-soft); color: var(--brand-strong)">{{ initials }}</span>
          <div class="min-w-0"><p class="font-semibold truncate">{{ auth.user?.fullName || '—' }}</p><p class="text-sm truncate" style="color: var(--ink-muted)">{{ auth.user?.email || '—' }}</p></div>
        </div>
      </UCard>

      <UCard>
        <template #header><h2 class="font-display font-semibold text-lg">{{ t('appearance') }}</h2></template>
        <div class="flex items-center justify-between gap-3">
          <div><p class="font-medium text-sm">{{ t('darkMode') }}</p><p class="text-xs mt-0.5" style="color: var(--ink-muted)">{{ t('changeInterface') }}</p></div>
          <div class="segmented">
            <button type="button" class="px-3 py-1.5 text-sm font-semibold flex items-center gap-1.5" :style="!isDark ? activeStyle : mutedStyle" @click="colorMode.preference = 'light'"><UIcon name="i-lucide-sun" class="w-4 h-4" /> {{ t('light') }}</button>
            <button type="button" class="px-3 py-1.5 text-sm font-semibold flex items-center gap-1.5" :style="isDark ? activeStyle : mutedStyle" @click="colorMode.preference = 'dark'"><UIcon name="i-lucide-moon" class="w-4 h-4" /> {{ t('dark') }}</button>
          </div>
        </div>
        <div class="flex items-center justify-between mt-4 pt-4 border-t" style="border-color: var(--line)">
          <div><p class="font-medium text-sm">{{ t('currency') }}</p><p class="text-xs mt-0.5" style="color: var(--ink-muted)">{{ t('allAmountsCurrency') }}</p></div>
          <span class="text-sm font-semibold px-3 py-1.5 rounded-lg" style="background: var(--paper); color: var(--ink-muted)">UZS</span>
        </div>
        <div class="flex items-center justify-between mt-4 pt-4 border-t" style="border-color: var(--line)">
          <div><p class="font-medium text-sm">{{ t('language') }}</p><p class="text-xs mt-0.5" style="color: var(--ink-muted)">{{ t('language') }}</p></div>
          <LanguageSwitcher />
        </div>
      </UCard>

      <UCard>
        <template #header><div class="flex items-center justify-between"><h2 class="font-display font-semibold text-lg">{{ t('categories') }}</h2><UButton icon="i-lucide-plus" size="xs" color="ledger" @click="openCreateCategory">{{ t('addAction') }}</UButton></div></template>
        <div class="space-y-2">
          <div v-for="c in categories" :key="c._id" class="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5" style="background: var(--paper)">
            <div class="flex items-center gap-3 min-w-0"><span class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style="background: var(--paper-alt)"><UIcon :name="`i-lucide-${c.icon}`" class="w-4.5 h-4.5" /></span><div class="min-w-0"><p class="text-sm font-medium truncate">{{ categoryLabel(c) }}</p><p class="text-xs" style="color: var(--ink-muted)">{{ typeLabel(c.type) }}</p></div></div>
            <div class="flex items-center gap-1 shrink-0"><UButton icon="i-lucide-pencil" color="gray" variant="ghost" square size="xs" @click="openEditCategory(c)" /><UButton v-if="!c.isDefault" icon="i-lucide-trash-2" color="red" variant="ghost" square size="xs" @click="deleteCategory(c)" /><span v-else class="text-[10px] px-2 py-1 rounded-md font-semibold uppercase" style="color: var(--ink-muted); background: var(--paper-alt)">{{ t('standard') }}</span></div>
          </div>
          <p v-if="!categories.length" class="text-sm text-center py-6" style="color: var(--ink-muted)">{{ t('noCategories') }}</p>
        </div>
      </UCard>

      <UCard>
        <template #header><h2 class="font-display font-semibold text-lg">{{ t('dataManagement') }}</h2></template>
        <div class="space-y-3">
          <button type="button" class="w-full text-left rounded-xl border px-4 py-3 transition hover:opacity-90" style="border-color: var(--line)" @click="startProfileAction('clear')"><p class="font-semibold text-sm">{{ t('clearData') }}</p><p class="text-xs mt-1" style="color: var(--ink-muted)">{{ t('clearDataDesc') }}</p></button>
          <button type="button" class="w-full text-left rounded-xl border px-4 py-3 transition hover:opacity-90" style="border-color: var(--line)" @click="startProfileAction('restart')"><p class="font-semibold text-sm">{{ t('restartProfile') }}</p><p class="text-xs mt-1" style="color: var(--ink-muted)">{{ t('restartProfileDesc') }}</p></button>
          <button type="button" class="w-full text-left rounded-xl border px-4 py-3 transition hover:opacity-90" style="border-color: color-mix(in srgb, var(--expense) 30%, var(--line)); color: var(--expense)" @click="startProfileAction('delete')"><p class="font-semibold text-sm">{{ t('deleteAccount') }}</p><p class="text-xs mt-1" style="color: var(--ink-muted)">{{ t('deleteAccountDesc') }}</p></button>
        </div>
      </UCard>

      <UCard><UButton block color="red" variant="soft" icon="i-lucide-log-out" @click="onLogout">{{ t('logout') }}</UButton></UCard>
    </div>

    <UModal v-model="categoryModalOpen">
      <UCard>
        <template #header><h3 class="font-display font-semibold text-lg">{{ editingCategoryId ? t('categoryEdit') : t('categoryNew') }}</h3></template>
        <div class="space-y-5">
          <UFormGroup :label="t('name')"><UInput v-model="categoryForm.name" :placeholder="t('categoryNamePlaceholder')" /></UFormGroup>
          <UFormGroup :label="t('type')"><div class="segmented w-full"><button type="button" class="flex-1 px-3 py-2 text-sm font-semibold" :style="categoryForm.type === 'expense' ? activeStyle : mutedStyle" @click="categoryForm.type = 'expense'">{{ t('expense') }}</button><button type="button" class="flex-1 px-3 py-2 text-sm font-semibold" :style="categoryForm.type === 'income' ? activeStyle : mutedStyle" @click="categoryForm.type = 'income'">{{ t('income') }}</button><button type="button" class="flex-1 px-3 py-2 text-sm font-semibold" :style="categoryForm.type === 'both' ? activeStyle : mutedStyle" @click="categoryForm.type = 'both'">{{ t('both') }}</button></div></UFormGroup>
          <UFormGroup :label="t('icon')"><div class="grid grid-cols-6 gap-2"><button v-for="icon in iconOptions" :key="icon" type="button" class="tile flex items-center justify-center p-2.5 rounded-xl" :data-active="categoryForm.icon === icon" @click="categoryForm.icon = icon"><UIcon :name="`i-lucide-${icon}`" class="w-4.5 h-4.5" /></button></div></UFormGroup>
          <UAlert v-if="categoryError" color="red" variant="soft" :title="categoryError" icon="i-lucide-alert-circle" />
        </div>
        <template #footer><UButton block size="lg" color="ledger" :loading="categorySaving" @click="saveCategory">{{ t('save') }}</UButton></template>
      </UCard>
    </UModal>

    <UModal v-model="passwordModalOpen" :ui="passwordModalUi">
      <UCard>
        <template #header><h3 class="font-display font-semibold text-lg">{{ t('confirmPassword') }}</h3></template>
        <div class="space-y-4">
          <p class="text-sm" style="color: var(--ink-muted)">{{ t('enterPasswordToContinue') }}</p>
          <UFormGroup :label="t('password')"><UInput v-model="profilePassword" type="password" :placeholder="t('passwordPlaceholder')" icon="i-lucide-lock" size="lg" @keyup.enter="submitProfileAction" /></UFormGroup>
          <UAlert v-if="passwordError" color="red" variant="soft" :title="passwordError" icon="i-lucide-alert-circle" />
        </div>
        <template #footer><div class="grid grid-cols-2 gap-2.5"><UButton block color="gray" variant="soft" size="lg" @click="passwordModalOpen = false">{{ t('cancel') }}</UButton><UButton block color="ledger" size="lg" :loading="passwordLoading" @click="submitProfileAction">{{ t('confirmAction') }}</UButton></div></template>
      </UCard>
    </UModal>
  </AppShell>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
definePageMeta({ middleware: 'auth' })
const { request } = useApi(); const auth = useAuthStore(); const router = useRouter(); const colorMode = useColorMode(); const { t, categoryLabel } = useI18n(); const { confirm } = useConfirm()
const isDark = computed(() => colorMode.value === 'dark')
const activeStyle = { background: 'var(--paper-alt)', color: 'var(--brand-strong)', boxShadow: '0 1px 2px rgba(22,33,28,0.06)' }; const mutedStyle = { color: 'var(--ink-muted)' }
const initials = computed(() => { const name = auth.user?.fullName || ''; return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || '?' })
function onLogout() { auth.logout(); router.push('/login') }
const categories = ref<any[]>([]); const successMessage = ref(''); const categoryModalOpen = ref(false); const editingCategoryId = ref<string | null>(null); const categorySaving = ref(false); const categoryError = ref('')
const iconOptions = ['utensils','car','shirt','home','heart-pulse','popcorn','wallet','dumbbell','gift','book-open','plane','fuel','smartphone','wifi','graduation-cap','baby','paw-print','coffee','shopping-bag','tv','music','briefcase','banknote','pill','scissors','trees','more-horizontal']
const categoryForm = reactive({ name: '', type: 'expense' as 'expense'|'income'|'both', icon: 'tag' })
function typeLabel(type: string) { if (type === 'income') return t('income'); if (type === 'both') return t('categoryBoth'); return t('expense') }
async function loadCategories() { categories.value = await request('/categories') }
function openCreateCategory() { editingCategoryId.value = null; categoryError.value = ''; categoryForm.name = ''; categoryForm.type = 'expense'; categoryForm.icon = 'tag'; categoryModalOpen.value = true }
function openEditCategory(c: any) { editingCategoryId.value = c._id; categoryError.value = ''; categoryForm.name = c.name; categoryForm.type = c.type; categoryForm.icon = c.icon; categoryModalOpen.value = true }
async function deleteCategory(c: any) { const ok = await confirm({ title: `${categoryLabel(c)}?`, description: t('cannotUndo'), confirmLabel: t('yesDelete'), cancelLabel: t('cancel'), color: 'red' }); if (!ok) return; try { await request(`/categories/${c._id}`, { method: 'DELETE' }); await loadCategories() } catch (e:any) { categoryError.value = e?.data?.message || t('categoryDeleteFailed') } }
async function saveCategory() { categoryError.value=''; if(!categoryForm.name.trim()){categoryError.value=t('nameRequired');return}; categorySaving.value=true; try { const body={name:categoryForm.name.trim(),type:categoryForm.type,icon:categoryForm.icon}; if(editingCategoryId.value) await request(`/categories/${editingCategoryId.value}`,{method:'PATCH',body}); else await request('/categories',{method:'POST',body}); categoryModalOpen.value=false; await loadCategories() } catch(e:any){categoryError.value=e?.data?.message||t('error')} finally{categorySaving.value=false} }

const passwordModalOpen = ref(false)
const profilePassword = ref('')
const passwordError = ref('')
const passwordLoading = ref(false)
const pendingAction = ref<'clear'|'restart'|'delete'|null>(null)
const passwordModalUi = {
  overlay: { background: 'bg-black/30 dark:bg-black/50 backdrop-blur-sm' },
  transition: { enter: 'ease-[cubic-bezier(0.22,1,0.36,1)] duration-500', enterFrom: 'opacity-0 -translate-y-40 scale-90 blur-md', enterTo: 'opacity-100 translate-y-0 scale-100 blur-none', leave: 'ease-in duration-200', leaveFrom: 'opacity-100 translate-y-0 scale-100 blur-none', leaveTo: 'opacity-0 -translate-y-10 scale-95 blur-sm' },
}
async function startProfileAction(action: 'clear'|'restart'|'delete') {
  const config = action === 'delete' ? { title: t('confirmDeleteTitle'), description: t('confirmDeleteDesc') } : action === 'restart' ? { title: t('confirmRestartTitle'), description: t('confirmRestartDesc') } : { title: t('confirmClearTitle'), description: t('confirmClearDesc') }
  const ok = await confirm({ ...config, confirmLabel: t('yesContinue'), cancelLabel: t('cancel'), color: action === 'delete' ? 'red' : 'ledger' })
  if (!ok) return
  pendingAction.value = action
  profilePassword.value = ''
  passwordError.value = ''
  passwordModalOpen.value = true
}
async function submitProfileAction() {
  if (!profilePassword.value.trim() || !pendingAction.value) return
  passwordLoading.value = true
  passwordError.value = ''
  try {
    const action = pendingAction.value
    const endpoint = action === 'delete' ? '/users/delete-account' : '/users/reset-data'
    await request(endpoint, { method: 'POST', body: { password: profilePassword.value } })
    passwordModalOpen.value = false
    if (action === 'delete') { auth.logout(); await router.push('/login'); return }
    await loadCategories()
    successMessage.value = action === 'restart' ? t('profileRestarted') : t('dataCleared')
    window.setTimeout(() => { successMessage.value = '' }, 3200)
    // Force a fresh page state after reset so report/list pages cannot keep stale
    // in-memory values from before the operation.
    await router.replace({ path: '/settings', query: { refreshed: String(Date.now()) } })
  } catch (e:any) {
    passwordError.value = e?.data?.message === 'INVALID_PASSWORD' ? t('wrongPassword') : (e?.data?.message || t('error'))
  } finally { passwordLoading.value = false }
}
onMounted(loadCategories)
</script>
