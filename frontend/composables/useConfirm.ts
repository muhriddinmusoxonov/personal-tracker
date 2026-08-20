// Butun ilova bo'ylab ishlatiladigan so'rov (confirm) oynasi uchun umumiy holat.
// Brauzerning standart `confirm()` oynasi o'rniga shu orqali chiroyli,
// "tomchi" animatsiyali va orqa foni blur qilingan so'rov oynasi chiqariladi.
//
// Ishlatilishi:
//   const { confirm } = useConfirm()
//   if (!(await confirm({ title: "...", description: "..." }))) return

export interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  color?: 'red' | 'ledger'
}

interface ConfirmState extends ConfirmOptions {
  open: boolean
  resolve: ((value: boolean) => void) | null
}

const state = reactive<ConfirmState>({
  open: false,
  title: '',
  description: '',
  confirmLabel: "Ha, o'chirish",
  cancelLabel: 'Bekor qilish',
  color: 'red',
  resolve: null,
})

export function useConfirm() {
  function confirm(options: ConfirmOptions): Promise<boolean> {
    state.title = options.title
    state.description = options.description || ''
    state.confirmLabel = options.confirmLabel || "Ha, o'chirish"
    state.cancelLabel = options.cancelLabel || 'Bekor qilish'
    state.color = options.color || 'red'
    state.open = true

    return new Promise<boolean>((resolve) => {
      state.resolve = resolve
    })
  }

  function respond(value: boolean) {
    state.open = false
    state.resolve?.(value)
    state.resolve = null
  }

  return { state, confirm, respond }
}
