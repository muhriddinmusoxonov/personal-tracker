export default defineAppConfig({
  ui: {
    primary: 'ledger',
    gray: 'stone',
    card: {
      base: 'transition-colors',
      background: 'bg-white dark:bg-[#17211C]',
      ring: 'ring-1 ring-[#DFE4DC] dark:ring-[#263129]',
      rounded: 'rounded-2xl',
      shadow: 'shadow-[0_1px_2px_rgba(22,33,28,0.04)]',
      body: { padding: 'px-5 py-5 sm:p-6' },
      header: { padding: 'px-5 py-4 sm:px-6' },
      footer: { padding: 'px-5 py-4 sm:px-6' },
    },
    button: {
      rounded: 'rounded-xl',
      font: 'font-semibold',
      default: { loadingIcon: 'i-lucide-loader-2' },
    },
    input: {
      rounded: 'rounded-xl',
      default: { size: 'md' },
    },
    formGroup: {
      label: { base: 'font-semibold text-[13px] tracking-wide uppercase text-[#5C6B62] dark:text-[#93A69A]' },
    },
    notifications: {
      position: 'top-0 bottom-auto',
    },
  },
})
