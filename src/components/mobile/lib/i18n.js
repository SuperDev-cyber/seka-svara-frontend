// Simple i18n for mobile static UI
export const translations = {
  'balance.title': { uz: 'Balans', ru: 'Баланс', en: 'Balance' },
  'balance.gas': { uz: 'Gaz', ru: 'Газ', en: 'Gas' },
  'balance.deposit': { uz: 'Depozit', ru: 'Депозит', en: 'Deposit' },
  'balance.withdraw': { uz: 'Pul yechish', ru: 'Вывод', en: 'Withdraw' },
  'balance.buyGas': { uz: 'BNB sotib olish', ru: 'Купить BNB', en: 'Buy Gas (BNB)' },
  'tables.title': { uz: 'Faol stollar', ru: 'Активные столы', en: 'Active Tables' },
  'tables.viewAll': { uz: "Barchasini ko'rish", ru: 'Посмотреть все', en: 'View All Tables >' },
  'tables.join': { uz: "Qo'shilish", ru: 'Присоединиться', en: 'Join' },
  'tables.spectate': { uz: "Kuzatish", ru: 'Наблюдать', en: 'Spectate' },
  'create.title': { uz: "Do'stlar bilan o'ynashni xohlaysizmi?", ru: 'Хотите играть с друзьями?', en: 'Want to play with friends?' },
  'create.button': { uz: 'Stol yaratish', ru: 'Создать стол', en: 'Create Table' },
  'howto.title': { uz: "Qanday o'ynash kerak?", ru: 'Как играть?', en: 'How to Play?' },
  'howto.link': { uz: '? Qoidalar va ko\'rsatmalar', ru: '? Правила и инструкции', en: '? Rules & Instructions' },
  'howto.step1': { uz: 'Hamyoningizni ulang', ru: 'Подключите кошелек', en: 'Connect your wallet' },
  'howto.step2': { uz: 'USDT depozit qiling', ru: 'Пополните USDT', en: 'Deposit USDT' },
  'howto.step3': { uz: "O'yinga qo'shiling", ru: 'Присоединяйтесь к игре', en: 'Join the game' },
  'nav.home': { uz: 'Bosh sahifa', ru: 'Главная', en: 'Home' },
  'nav.play': { uz: "O'ynash", ru: 'Играть', en: 'Play' },
  'nav.wallet': { uz: 'Hamyon', ru: 'Кошелек', en: 'Wallet' },
  'nav.profile': { uz: 'Profil', ru: 'Профиль', en: 'Profile' },
  'nav.settings': { uz: 'Sozlamalar', ru: 'Настройки', en: 'Settings' },
  'lobby.title': { uz: 'O\'yin zali', ru: 'Игровой зал', en: 'Game Lobby' },
  'tables.players': { uz: "O'yinchilar", ru: 'Игроки', en: 'Players' },
  'activity.title': { uz: 'So\'nggi faoliyat', ru: 'Недавняя активность', en: 'Recent Activity' },
  'activity.deposit': { uz: 'Depozit', ru: 'Депозит', en: 'Deposit' },
  'activity.payout': { uz: 'To\'lov', ru: 'Выплата', en: 'Payout' },
  'activity.refund': { uz: 'Qaytarish', ru: 'Возврат', en: 'Refund' },
  'activity.viewAll': { uz: 'Barchasini ko\'rish', ru: 'Посмотреть все', en: 'View All' },
};

export function useTranslation(lang = 'en') {
  return (key) => translations[key]?.[lang] || translations[key]?.en || key;
}

