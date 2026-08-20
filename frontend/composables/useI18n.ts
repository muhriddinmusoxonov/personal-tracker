export type AppLocale = 'uz' | 'ru' | 'en'

const messages: Record<AppLocale, Record<string, string>> = {
  uz: {
    appName: 'Xarajatlarim', accounting: 'Hisob-kitob', analysis: 'Tahlil', list: "Ro'yxat", add: "Qo'shish", budget: 'Byudjet', settings: 'Sozlamalar',
    login: 'Tizimga kirish', register: "Ro'yxatdan o'tish", continueExpenses: 'Xarajatlaringizni davom ettiring', startTracking: 'Xarajatlaringizni kuzatishni boshlang',
    fullName: 'Ism familiya', password: 'Parol', email: 'Email', loginAction: 'Kirish', registerAction: "Ro'yxatdan o'tish", atLeast6: 'Kamida 6 belgi',
    profile: 'Profil', appearance: "Ko'rinish", darkMode: 'Tungi rejim', changeInterface: 'Interfeys rangini almashtiring', light: 'Kunduzgi', dark: 'Tungi',
    currency: "so'm", allAmountsCurrency: "Barcha summalar shu valyutada ko'rsatiladi", categories: 'Kategoriyalar', addAction: "Qo'shish", standard: 'Standart', noCategories: "Kategoriyalar yo'q",
    save: 'Saqlash', logout: 'Tizimdan chiqish', cancel: 'Bekor qilish', yesDelete: "Ha, o'chirish", yesContinue: 'Davom etish',
    income: 'Kirim', expense: 'Chiqim', both: 'Ikkalasi', type: 'Turi', name: 'Nomi', icon: 'Ikonka', category: 'Kategoriya', paymentType: "To'lov turi", amount: 'Miqdor',
    date: 'Sana', balance: 'Balans', personal: 'Personal', company: 'Company', all: 'Barchasi', cash: 'Naqd', card: 'Karta', comment: 'Izoh', optional: 'ixtiyoriy',
    commentPlaceholder: 'Izoh yozing...', receipt: 'Chek yoki skrinshot', chooseImage: 'Rasm tanlash yoki skrinshot yuklash', ai: 'AI orqali avtomatik aniqlash (summa va category)', result: 'Natija',
    successAdded: "Muvaffaqiyatli qo'shildi!", error: 'Xatolik yuz berdi', categoryRequired: 'Category tanlanmadi', amountRequired: 'Miqdor kiriting yoki chek rasmini yuklang',
    filters: 'Filtrlash', clear: 'Tozalash', searchComment: 'Izohdan qidirish...', selected: 'tanlangan', transactions: 'tranzaksiya', dataNotFound: "Ma'lumot topilmadi", close: 'Yopish', details: 'Batafsil',
    receiptMissing: 'Chek rasmi yuklanmagan', total: 'Umumiy', currentBalance: 'Joriy balans', categoryExpenses: "Kategoriyalar bo'yicha chiqimlar", noExpensesPeriod: 'Bu davrda chiqimlar mavjud emas',
    budgetsThisMonth: 'Byudjetlar (shu oy)', allBudgets: 'Barchasi', noBudget: "Hali byudjet o'rnatilmagan", addBudget: "Byudjet qo'shish", firstBudget: "Birinchi byudjetni qo'shish",
    totalSpent: 'Jami sarflangan', limit: 'limitdan', remaining: 'qoldi', exceeded: 'limitdan oshdi', budgetExistsNone: 'Byudjetlar mavjud emas', monthlyLimitHint: 'Xarajatlaringizni nazorat qilish uchun oylik limit qo\'ying',
    editBudget: 'Byudjetni tahrirlash', newBudget: 'Yangi byudjet', overall: 'Umumiy', byCategory: "Kategoriya bo'yicha", monthlyLimit: 'Oylik limit', allBalances: 'Barcha balanslar',
    download: 'Yuklab olish', exportReport: 'Hisobotni yuklab olish (Excel)', downloadExcel: 'Excel faylni yuklab olish', period: 'Davr', day: 'Kun', week: 'Hafta', month: 'Oy', year: 'Yil',
    dataManagement: "Ma'lumotlar", clearData: "Ma'lumotlarni tozalash", clearDataDesc: 'Barcha tranzaksiyalar, byudjetlar, balans va kategoriyalar o\'chiriladi. Login va parol saqlanadi.',
    restartProfile: 'Profilni qayta boshlash', restartProfileDesc: 'Profil ma\'lumotlarini noldan boshlaydi. Login va parol saqlanadi.', deleteAccount: "Akkountni o'chirish", deleteAccountDesc: 'Profil, barcha ma\'lumotlar, login va parol butunlay o\'chiriladi.',
    confirmClearTitle: "Barcha ma'lumotlarni tozalaysizmi?", confirmClearDesc: 'Bu amalni ortga qaytarib bo\'lmaydi. Davom etish uchun parolingiz so\'raladi.',
    confirmRestartTitle: 'Profilni qayta boshlaysizmi?', confirmRestartDesc: 'Barcha profil ma\'lumotlari o\'chiriladi, login va parol qoladi. Davom etish uchun parolingiz so\'raladi.',
    confirmDeleteTitle: "Akkountni o'chirasizmi?", confirmDeleteDesc: 'Bu amal profilni va login/parolni butunlay o\'chiradi. Davom etish uchun parolingiz so\'raladi.',
    enterPasswordToContinue: 'Davom etish uchun profilingiz parolini kiriting.', confirmPassword: 'Parolni tasdiqlash', passwordPlaceholder: 'Profil paroli', confirmAction: 'Tasdiqlash', wrongPassword: "Parol noto'g'ri", invalidCredentials: "Email yoki parol noto'g'ri", emailExists: "Bu email allaqachon ro'yxatdan o'tgan", dataCleared: "Ma'lumotlar tozalandi", profileRestarted: 'Profil qayta boshlandi', accountDeleted: 'Akkount o\'chirildi',
    categoryNamePlaceholder: 'masalan: Kitoblar', categoryEdit: 'Kategoriyani tahrirlash', categoryNew: 'Yangi kategoriya', categoryBoth: 'Kirim va chiqim', categoryDeleteFailed: "Kategoriyani o'chirib bo'lmadi", cannotUndo: 'Bu amalni ortga qaytarib bo\'lmaydi.', nameRequired: 'Nomini kiriting',
    language: 'Til', uzbek: "O'zbekcha", russian: 'Русский', english: 'English',
    jan: 'Yanvar', feb: 'Fevral', mar: 'Mart', apr: 'Aprel', may: 'May', jun: 'Iyun', jul: 'Iyul', aug: 'Avgust', sep: 'Sentabr', oct: 'Oktabr', nov: 'Noyabr', dec: 'Dekabr',
    categorySport: 'Sport', categoryFood: 'Ovqatlanish', categoryTransport: 'Transport', categoryClothes: 'Kiyim', categoryUtilities: 'Kommunal', categoryHealth: 'Salomatlik', categoryEntertainment: 'Ko\'ngilochar', categorySalary: 'Oylik / Maosh', categoryOther: 'Boshqa',
    categorySportRu: 'Спорт', categoryFoodRu: 'Питание', categoryTransportRu: 'Транспорт', categoryClothesRu: 'Одежда', categoryUtilitiesRu: 'Коммунальные', categoryHealthRu: 'Здоровье', categoryEntertainmentRu: 'Развлечения', categorySalaryRu: 'Зарплата', categoryOtherRu: 'Другое',
    categorySportEn: 'Sport', categoryFoodEn: 'Food', categoryTransportEn: 'Transport', categoryClothesEn: 'Clothes', categoryUtilitiesEn: 'Utilities', categoryHealthEn: 'Health', categoryEntertainmentEn: 'Entertainment', categorySalaryEn: 'Salary', categoryOtherEn: 'Other',
    noBudgetText: 'Byudjetlar mavjud emas', search: 'Qidirish',
  },
  ru: {
    appName: 'Мои расходы', accounting: 'Учёт', analysis: 'Анализ', list: 'Список', add: 'Добавить', budget: 'Бюджет', settings: 'Настройки',
    login: 'Вход в систему', register: 'Регистрация', continueExpenses: 'Продолжайте учитывать расходы', startTracking: 'Начните отслеживать расходы', fullName: 'Имя и фамилия', password: 'Пароль', email: 'Email', loginAction: 'Войти', registerAction: 'Зарегистрироваться', atLeast6: 'Минимум 6 символов',
    profile: 'Профиль', appearance: 'Внешний вид', darkMode: 'Тёмный режим', changeInterface: 'Изменить оформление интерфейса', light: 'Светлая', dark: 'Тёмная', currency: 'сум', allAmountsCurrency: 'Все суммы отображаются в этой валюте', categories: 'Категории', addAction: 'Добавить', standard: 'Стандарт', noCategories: 'Категорий нет', save: 'Сохранить', logout: 'Выйти', cancel: 'Отмена', yesDelete: 'Да, удалить', yesContinue: 'Продолжить',
    income: 'Доход', expense: 'Расход', both: 'Оба', type: 'Тип', name: 'Название', icon: 'Иконка', category: 'Категория', paymentType: 'Тип оплаты', amount: 'Сумма', date: 'Дата', balance: 'Баланс', personal: 'Личный', company: 'Компания', all: 'Все', cash: 'Наличные', card: 'Карта', comment: 'Комментарий', optional: 'необязательно', commentPlaceholder: 'Введите комментарий...', receipt: 'Чек или скриншот', chooseImage: 'Выберите изображение или загрузите скриншот', ai: 'Автоматическое определение через AI (сумма и категория)', result: 'Результат', successAdded: 'Успешно добавлено!', error: 'Произошла ошибка', categoryRequired: 'Категория не выбрана', amountRequired: 'Введите сумму или загрузите фото чека',
    filters: 'Фильтровать', clear: 'Очистить', searchComment: 'Поиск по комментарию...', selected: 'выбрано', transactions: 'транзакций', dataNotFound: 'Данные не найдены', close: 'Закрыть', details: 'Подробнее', receiptMissing: 'Фото чека не загружено', total: 'Все', currentBalance: 'Текущий баланс', categoryExpenses: 'Расходы по категориям', noExpensesPeriod: 'За этот период расходов нет', budgetsThisMonth: 'Бюджеты (этот месяц)', allBudgets: 'Все', noBudget: 'Бюджет ещё не установлен', addBudget: 'Добавить бюджет', firstBudget: 'Добавить первый бюджет', totalSpent: 'Всего потрачено', limit: 'лимита', remaining: 'осталось', exceeded: 'сверх лимита', budgetExistsNone: 'Бюджетов нет', monthlyLimitHint: 'Установите месячный лимит, чтобы контролировать расходы', editBudget: 'Редактировать бюджет', newBudget: 'Новый бюджет', overall: 'Общий', byCategory: 'По категории', monthlyLimit: 'Месячный лимит', allBalances: 'Все балансы', download: 'Скачать', exportReport: 'Скачать отчёт (Excel)', downloadExcel: 'Скачать Excel-файл', period: 'Период', day: 'День', week: 'Неделя', month: 'Месяц', year: 'Год',
    dataManagement: 'Данные', clearData: 'Очистить данные', clearDataDesc: 'Удаляются все транзакции, бюджеты, баланс и категории. Логин и пароль сохраняются.', restartProfile: 'Перезапустить профиль', restartProfileDesc: 'Профиль будет очищен и начнётся заново. Логин и пароль сохраняются.', deleteAccount: 'Удалить аккаунт', deleteAccountDesc: 'Профиль, все данные, логин и пароль будут удалены навсегда.', confirmClearTitle: 'Очистить все данные?', confirmClearDesc: 'Это действие нельзя отменить. Для продолжения потребуется пароль.', confirmRestartTitle: 'Перезапустить профиль?', confirmRestartDesc: 'Все данные профиля будут удалены, логин и пароль останутся. Для продолжения потребуется пароль.', confirmDeleteTitle: 'Удалить аккаунт?', confirmDeleteDesc: 'Это действие полностью удалит профиль и логин/пароль. Для продолжения потребуется пароль.', enterPasswordToContinue: 'Введите пароль профиля для продолжения.', confirmPassword: 'Подтверждение пароля', passwordPlaceholder: 'Пароль профиля', confirmAction: 'Подтвердить', wrongPassword: 'Неверный пароль', invalidCredentials: 'Неверный email или пароль', emailExists: 'Этот email уже зарегистрирован', dataCleared: 'Данные очищены', profileRestarted: 'Профиль перезапущен', accountDeleted: 'Аккаунт удалён', categoryNamePlaceholder: 'например: Книги', categoryEdit: 'Редактировать категорию', categoryNew: 'Новая категория', categoryBoth: 'Доход и расход', categoryDeleteFailed: 'Не удалось удалить категорию', cannotUndo: 'Это действие нельзя отменить.', nameRequired: 'Введите название', language: 'Язык', uzbek: 'O‘zbekcha', russian: 'Русский', english: 'English', jan: 'Январь', feb: 'Февраль', mar: 'Март', apr: 'Апрель', may: 'Май', jun: 'Июнь', jul: 'Июль', aug: 'Август', sep: 'Сентябрь', oct: 'Октябрь', nov: 'Ноябрь', dec: 'Декабрь', categorySport: 'Спорт', categoryFood: 'Питание', categoryTransport: 'Транспорт', categoryClothes: 'Одежда', categoryUtilities: 'Коммунальные', categoryHealth: 'Здоровье', categoryEntertainment: 'Развлечения', categorySalary: 'Зарплата', categoryOther: 'Другое', categorySportRu: 'Спорт', categoryFoodRu: 'Питание', categoryTransportRu: 'Транспорт', categoryClothesRu: 'Одежда', categoryUtilitiesRu: 'Коммунальные', categoryHealthRu: 'Здоровье', categoryEntertainmentRu: 'Развлечения', categorySalaryRu: 'Зарплата', categoryOtherRu: 'Другое', categorySportEn: 'Sport', categoryFoodEn: 'Food', categoryTransportEn: 'Transport', categoryClothesEn: 'Clothes', categoryUtilitiesEn: 'Utilities', categoryHealthEn: 'Health', categoryEntertainmentEn: 'Entertainment', categorySalaryEn: 'Salary', categoryOtherEn: 'Other', noBudgetText: 'Бюджетов нет', search: 'Поиск',
  },
  en: {
    appName: 'My Expenses', accounting: 'Accounting', analysis: 'Analysis', list: 'List', add: 'Add', budget: 'Budget', settings: 'Settings', login: 'Sign in', register: 'Create account', continueExpenses: 'Continue tracking your expenses', startTracking: 'Start tracking your expenses', fullName: 'Full name', password: 'Password', email: 'Email', loginAction: 'Sign in', registerAction: 'Create account', atLeast6: 'At least 6 characters',
    profile: 'Profile', appearance: 'Appearance', darkMode: 'Dark mode', changeInterface: 'Change the interface appearance', light: 'Light', dark: 'Dark', currency: 'UZS', allAmountsCurrency: 'All amounts are shown in this currency', categories: 'Categories', addAction: 'Add', standard: 'Default', noCategories: 'No categories', save: 'Save', logout: 'Log out', cancel: 'Cancel', yesDelete: 'Yes, delete', yesContinue: 'Continue',
    income: 'Income', expense: 'Expense', both: 'Both', type: 'Type', name: 'Name', icon: 'Icon', category: 'Category', paymentType: 'Payment type', amount: 'Amount', date: 'Date', balance: 'Balance', personal: 'Personal', company: 'Company', all: 'All', cash: 'Cash', card: 'Card', comment: 'Comment', optional: 'optional', commentPlaceholder: 'Write a comment...', receipt: 'Receipt or screenshot', chooseImage: 'Choose an image or upload a screenshot', ai: 'Automatic AI detection (amount and category)', result: 'Result', successAdded: 'Added successfully!', error: 'Something went wrong', categoryRequired: 'No category selected', amountRequired: 'Enter an amount or upload a receipt image',
    filters: 'Filter', clear: 'Clear', searchComment: 'Search comments...', selected: 'selected', transactions: 'transactions', dataNotFound: 'No data found', close: 'Close', details: 'Details', receiptMissing: 'Receipt image not uploaded', total: 'All', currentBalance: 'Current balance', categoryExpenses: 'Expenses by category', noExpensesPeriod: 'No expenses for this period', budgetsThisMonth: 'Budgets (this month)', allBudgets: 'All', noBudget: 'No budget set yet', addBudget: 'Add budget', firstBudget: 'Add your first budget', totalSpent: 'Total spent', limit: 'of limit', remaining: 'remaining', exceeded: 'over limit', budgetExistsNone: 'No budgets', monthlyLimitHint: 'Set a monthly limit to control your expenses', editBudget: 'Edit budget', newBudget: 'New budget', overall: 'Overall', byCategory: 'By category', monthlyLimit: 'Monthly limit', allBalances: 'All balances', download: 'Download', exportReport: 'Download report (Excel)', downloadExcel: 'Download Excel file', period: 'Period', day: 'Day', week: 'Week', month: 'Month', year: 'Year',
    dataManagement: 'Data', clearData: 'Clear data', clearDataDesc: 'All transactions, budgets, balance and categories will be deleted. Login and password are kept.', restartProfile: 'Restart profile', restartProfileDesc: 'The profile starts from scratch. Login and password are kept.', deleteAccount: 'Delete account', deleteAccountDesc: 'The profile, all data, login and password will be permanently deleted.', confirmClearTitle: 'Clear all data?', confirmClearDesc: 'This action cannot be undone. Your password will be required to continue.', confirmRestartTitle: 'Restart profile?', confirmRestartDesc: 'All profile data will be deleted, while login and password remain. Your password will be required to continue.', confirmDeleteTitle: 'Delete account?', confirmDeleteDesc: 'This will permanently delete the profile and login/password. Your password will be required to continue.', enterPasswordToContinue: 'Enter your profile password to continue.', confirmPassword: 'Confirm password', passwordPlaceholder: 'Profile password', confirmAction: 'Confirm', wrongPassword: 'Incorrect password', invalidCredentials: 'Incorrect email or password', emailExists: 'This email is already registered', dataCleared: 'Data cleared', profileRestarted: 'Profile restarted', accountDeleted: 'Account deleted', categoryNamePlaceholder: 'e.g. Books', categoryEdit: 'Edit category', categoryNew: 'New category', categoryBoth: 'Income and expense', categoryDeleteFailed: 'Could not delete category', cannotUndo: 'This action cannot be undone.', nameRequired: 'Enter a name', language: 'Language', uzbek: 'O‘zbekcha', russian: 'Русский', english: 'English', jan: 'January', feb: 'February', mar: 'March', apr: 'April', may: 'May', jun: 'June', jul: 'July', aug: 'August', sep: 'September', oct: 'October', nov: 'November', dec: 'December', categorySport: 'Sport', categoryFood: 'Food', categoryTransport: 'Transport', categoryClothes: 'Clothes', categoryUtilities: 'Utilities', categoryHealth: 'Health', categoryEntertainment: 'Entertainment', categorySalary: 'Salary', categoryOther: 'Other', categorySportRu: 'Спорт', categoryFoodRu: 'Питание', categoryTransportRu: 'Транспорт', categoryClothesRu: 'Одежда', categoryUtilitiesRu: 'Коммунальные', categoryHealthRu: 'Здоровье', categoryEntertainmentRu: 'Развлечения', categorySalaryRu: 'Зарплата', categoryOtherRu: 'Другое', categorySportEn: 'Sport', categoryFoodEn: 'Food', categoryTransportEn: 'Transport', categoryClothesEn: 'Clothes', categoryUtilitiesEn: 'Utilities', categoryHealthEn: 'Health', categoryEntertainmentEn: 'Entertainment', categorySalaryEn: 'Salary', categoryOtherEn: 'Other', noBudgetText: 'No budgets', search: 'Search',
  },
}

export function useI18n() {
  const locale = useCookie<AppLocale>('expense-locale', { default: () => 'uz' })
  const currentLocale = computed(() => locale.value || 'uz')
  const messagesForLocale = computed(() => messages[currentLocale.value])

  function t(key: string, vars?: Record<string, string | number>) {
    let value = messagesForLocale.value[key] ?? messages.uz[key] ?? key
    if (vars) for (const [name, replacement] of Object.entries(vars)) value = value.replace(new RegExp(`\\{${name}\\}`, 'g'), String(replacement))
    return value
  }

  function setLocale(next: AppLocale) {
    locale.value = next
    if (process.client) document.documentElement.lang = next
  }

  const localeTag = computed(() => currentLocale.value === 'ru' ? 'ru-RU' : currentLocale.value === 'en' ? 'en-US' : 'uz-UZ')

  function formatMoney(n: number) {
    const value = new Intl.NumberFormat(localeTag.value).format(n || 0)
    return currentLocale.value === 'uz' ? `${value} ${t('currency')}` : `${value} ${t('currency')}`
  }

  function categoryLabel(category: any) {
    if (!category) return ''
    // MUHIM: ikonka bo'yicha tarjima faqat standart (isDefault) kategoriyalar uchun ishlaydi.
    // Aks holda, foydalanuvchi o'zi yaratgan (custom) kategoriya standart kategoriyalardan
    // biri bilan bir xil ikonkani tanlasa (masalan "utensils"), ikkalasi ham interfeysda
    // aynan bir xil nom bilan ko'rinib qolar edi — garchi ular backendda butunlay boshqa-boshqa
    // _id'ga ega bo'lsa-da. Bu esa, masalan, byudjet bitta kategoriyaga (bir _id) bog'langan
    // bo'lsa-yu, tranzaksiya boshqa (lekin bir xil nomda ko'rinadigan) kategoriyaga yozilgan
    // bo'lsa, byudjetda "sarflangan" summa hech qachon yangilanmasligiga olib kelardi.
    if (category.isDefault) {
      const keyByIcon: Record<string, string> = {
        dumbbell: 'categorySport', utensils: 'categoryFood', car: 'categoryTransport', shirt: 'categoryClothes', home: 'categoryUtilities',
        'heart-pulse': 'categoryHealth', popcorn: 'categoryEntertainment', wallet: 'categorySalary', 'more-horizontal': 'categoryOther',
      }
      const key = keyByIcon[category.icon]
      if (key) return t(key)
    }
    return category.name
  }

  return { locale: currentLocale, t, setLocale, localeTag, formatMoney, categoryLabel }
}
