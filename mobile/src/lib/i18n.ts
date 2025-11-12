export type Language = 'uz' | 'ru' | 'en';

export const translations = {
  // Header
  'header.notifications': {
    uz: 'Bildirishnomalar',
    ru: 'Уведомления',
    en: 'Notifications',
  },
  
  // Balance Card
  'balance.title': {
    uz: 'Balans',
    ru: 'Баланс',
    en: 'Balance',
  },
  'balance.gas': {
    uz: 'Gaz',
    ru: 'Газ',
    en: 'Gas',
  },
  'balance.deposit': {
    uz: 'Depozit',
    ru: 'Депозит',
    en: 'Deposit',
  },
  'balance.withdraw': {
    uz: 'Pul yechish',
    ru: 'Вывод',
    en: 'Withdraw',
  },
  'balance.buyGas': {
    uz: 'BNB sotib olish',
    ru: 'Купить BNB',
    en: 'Buy Gas (BNB)',
  },
  
  // Game Tables
  'tables.title': {
    uz: 'Faol stollar',
    ru: 'Активные столы',
    en: 'Active Tables',
  },
  'tables.players': {
    uz: "O'yinchilar",
    ru: 'Игроки',
    en: 'Players',
  },
  'tables.join': {
    uz: "Qo'shilish",
    ru: 'Присоединиться',
    en: 'Join',
  },
  'tables.spectate': {
    uz: 'Tomosha qilish',
    ru: 'Наблюдать',
    en: 'Spectate',
  },
  'tables.viewAll': {
    uz: "Barcha stollarni ko'rish",
    ru: 'Все столы',
    en: 'View All Tables',
  },
  
  // Create Table
  'create.title': {
    uz: "Do'stlar bilan o'ynashni xohlaysizmi?",
    ru: 'Хотите играть с друзьями?',
    en: 'Want to play with friends?',
  },
  'create.button': {
    uz: 'Yangi stol yaratish',
    ru: 'Создать стол',
    en: 'Create Table',
  },
  
  // How To
  'howto.title': {
    uz: "Qanday o'ynash?",
    ru: 'Как играть?',
    en: 'How to Play?',
  },
  'howto.step1': {
    uz: 'Hamyoningizni ulang',
    ru: 'Подключите кошелек',
    en: 'Connect your wallet',
  },
  'howto.step2': {
    uz: 'USDT depozit qiling',
    ru: 'Пополните USDT',
    en: 'Deposit USDT',
  },
  'howto.step3': {
    uz: "Qo'shiling va o'ynang!",
    ru: 'Присоединяйтесь и играйте!',
    en: 'Join and Play!',
  },
  'howto.link': {
    uz: "Qoidalar va ko'rsatmalar",
    ru: 'Правила и инструкции',
    en: 'Rules & Instructions',
  },
  
  // Promo
  'promo.text': {
    uz: '🎉 Yangi foydalanuvchilar uchun 0% komissiya - bugun!',
    ru: '🎉 0% комиссия для новичков - только сегодня!',
    en: '🎉 0% commission for new users – today only!',
  },
  
  // Recent Activity
  'activity.title': {
    uz: 'Oxirgi harakatlar',
    ru: 'Недавняя активность',
    en: 'Recent Activity',
  },
  'activity.viewAll': {
    uz: 'Barchasini ko\'rish',
    ru: 'Посмотреть все',
    en: 'View All',
  },
  'activity.deposit': {
    uz: 'Depozit',
    ru: 'Депозит',
    en: 'Deposit',
  },
  'activity.payout': {
    uz: "To'lov",
    ru: 'Выплата',
    en: 'Payout',
  },
  'activity.refund': {
    uz: 'Qaytarish',
    ru: 'Возврат',
    en: 'Refund',
  },
  
  // Bottom Nav
  'nav.home': {
    uz: 'Bosh sahifa',
    ru: 'Главная',
    en: 'Home',
  },
  'nav.play': {
    uz: "O'ynash",
    ru: 'Играть',
    en: 'Play',
  },
  'nav.wallet': {
    uz: 'Hamyon',
    ru: 'Кошелек',
    en: 'Wallet',
  },
  'nav.profile': {
    uz: 'Profil',
    ru: 'Профиль',
    en: 'Profile',
  },
  'nav.settings': {
    uz: 'Sozlamalar',
    ru: 'Настройки',
    en: 'Settings',
  },
  
  // Lobby
  'lobby.title': {
    uz: "O'yin stollari",
    ru: 'Игровые столы',
    en: 'Game Tables',
  },
  'lobby.back': {
    uz: 'Orqaga',
    ru: 'Назад',
    en: 'Back',
  },
  'lobby.stake': {
    uz: 'Stavka',
    ru: 'Ставка',
    en: 'Stake',
  },
  'lobby.players': {
    uz: "O'yinchilar",
    ru: 'Игроки',
    en: 'Players',
  },
  'lobby.gameType': {
    uz: "O'yin turi",
    ru: 'Тип игры',
    en: 'Game Type',
  },
  'lobby.public': {
    uz: 'Ochiq',
    ru: 'Публичная',
    en: 'Public',
  },
  'lobby.private': {
    uz: 'Yopiq',
    ru: 'Приватная',
    en: 'Private',
  },
  'lobby.all': {
    uz: 'Hammasi',
    ru: 'Все',
    en: 'All',
  },
  'lobby.search': {
    uz: 'ID yoki stavka orqali qidirish',
    ru: 'Поиск по ID или ставке',
    en: 'Search by ID or stake',
  },
  'lobby.join': {
    uz: "Qo'shilish",
    ru: 'Присоединиться',
    en: 'Join Game',
  },
  'lobby.spectate': {
    uz: 'Tomosha',
    ru: 'Наблюдать',
    en: 'Spectate',
  },
  'lobby.waiting': {
    uz: 'Kutilmoqda',
    ru: 'Ожидание',
    en: 'Waiting',
  },
  'lobby.inGame': {
    uz: "O'yinda",
    ru: 'В игре',
    en: 'In Game',
  },
  'lobby.finished': {
    uz: 'Tugadi',
    ru: 'Завершена',
    en: 'Finished',
  },
  'lobby.pot': {
    uz: 'Bank',
    ru: 'Банк',
    en: 'Pot',
  },
  'lobby.empty': {
    uz: "Hozircha stol yo'q",
    ru: 'Нет доступных столов',
    en: 'No tables available',
  },
  'lobby.emptyDesc': {
    uz: "Quyida yangi stol yarating 👇",
    ru: 'Создайте новый стол ниже 👇',
    en: 'Create one below 👇',
  },
  'lobby.createTitle': {
    uz: 'Yangi stol yaratish',
    ru: 'Создать новый стол',
    en: 'Create New Table',
  },
  'lobby.create': {
    uz: 'Stol yaratish',
    ru: 'Создать стол',
    en: 'Create Table',
  },
  'lobby.autoStart': {
    uz: 'Avto-start',
    ru: 'Авто-старт',
    en: 'Auto-start',
  },
  'lobby.modalTitle': {
    uz: "O'yinga qo'shilish",
    ru: 'Присоединиться к игре',
    en: 'Join Game',
  },
  'lobby.walletAddress': {
    uz: 'Hamyon manzili',
    ru: 'Адрес кошелька',
    en: 'Wallet Address',
  },
  'lobby.platformFee': {
    uz: 'Platforma komissiyasi',
    ru: 'Комиссия платформы',
    en: 'Platform fee',
  },
  'lobby.approve': {
    uz: 'Tasdiqlash',
    ru: 'Одобрить',
    en: 'Approve USDT',
  },
  'lobby.deposit': {
    uz: 'Depozitga joylash',
    ru: 'Внести депозит',
    en: 'Deposit to Escrow',
  },
  'lobby.cancel': {
    uz: 'Bekor qilish',
    ru: 'Отмена',
    en: 'Cancel',
  },
  'lobby.pending': {
    uz: 'Tranzaksiya kutilmoqda...',
    ru: 'Транзакция в ожидании...',
    en: 'Transaction Pending...',
  },
  'lobby.success': {
    uz: 'Muvaffaqiyatli ✅',
    ru: 'Успешно ✅',
    en: 'Success ✅',
  },
  'lobby.recentWinners': {
    uz: 'Yaqinda g\'oliblar',
    ru: 'Недавние победители',
    en: 'Recent winners',
  },
  
  // Wallet
  'wallet.title': {
    uz: 'Hamyon',
    ru: 'Кошелек',
    en: 'Wallet',
  },
  'wallet.balance': {
    uz: 'Balans',
    ru: 'Баланс',
    en: 'Balance',
  },
  'wallet.deposit': {
    uz: 'Depozit',
    ru: 'Депозит',
    en: 'Deposit',
  },
  'wallet.withdraw': {
    uz: 'Pul yechish',
    ru: 'Вывод',
    en: 'Withdraw',
  },
  'wallet.buyGas': {
    uz: 'BNB sotib olish',
    ru: 'Купить BNB',
    en: 'Buy BNB for Gas',
  },
  'wallet.network': {
    uz: 'Tarmoq: Binance Smart Chain (BEP20)',
    ru: 'Сеть: Binance Smart Chain (BEP20)',
    en: 'Network: Binance Smart Chain (BEP20)',
  },
  'wallet.escrowConnected': {
    uz: 'Escrow ulangan',
    ru: 'Escrow подключен',
    en: 'Escrow Connected',
  },
  'wallet.escrowDisconnected': {
    uz: 'Escrow ulanmagan',
    ru: 'Escrow отключен',
    en: 'Escrow Disconnected',
  },
  'wallet.history': {
    uz: "So'nggi tranzaksiyalar",
    ru: 'Недавние транзакции',
    en: 'Recent Transactions',
  },
  'wallet.viewAll': {
    uz: "Barchasini ko'rish",
    ru: 'Посмотреть все',
    en: 'View All',
  },
  'wallet.empty': {
    uz: "Hozircha tranzaksiya yo'q",
    ru: 'Пока нет транзакций',
    en: 'No transactions yet',
  },
  'wallet.emptyDesc': {
    uz: 'Depozit qilishni boshlang',
    ru: 'Начните с депозита',
    en: 'Start by making a deposit',
  },
  'wallet.depositTitle': {
    uz: 'Depozit qilish',
    ru: 'Пополнить депозит',
    en: 'Deposit USDT to Game Escrow',
  },
  'wallet.withdrawTitle': {
    uz: 'Pul yechish',
    ru: 'Вывести средства',
    en: 'Withdraw from Escrow',
  },
  'wallet.amount': {
    uz: 'Miqdor',
    ru: 'Сумма',
    en: 'Amount',
  },
  'wallet.min': {
    uz: 'Min',
    ru: 'Мин',
    en: 'Min',
  },
  'wallet.max': {
    uz: 'Maks',
    ru: 'Макс',
    en: 'Max',
  },
  'wallet.approve': {
    uz: 'Tasdiqlash',
    ru: 'Одобрить',
    en: 'Approve USDT',
  },
  'wallet.depositNow': {
    uz: 'Depozit qilish',
    ru: 'Внести депозит',
    en: 'Deposit Now',
  },
  'wallet.withdrawNow': {
    uz: 'Yechib olish',
    ru: 'Вывести',
    en: 'Withdraw Now',
  },
  'wallet.pending': {
    uz: 'Tranzaksiya kutilmoqda...',
    ru: 'Транзакция в ожидании...',
    en: 'Transaction pending...',
  },
  'wallet.success': {
    uz: 'Muvaffaqiyatli',
    ru: 'Успешно',
    en: 'Success',
  },
  'wallet.depositSuccess': {
    uz: 'Depozit muvaffaqiyatli amalga oshirildi!',
    ru: 'Депозит успешно выполнен!',
    en: 'Deposit successful!',
  },
  'wallet.withdrawSuccess': {
    uz: 'Pul muvaffaqiyatli yechildi!',
    ru: 'Вывод успешно выполнен!',
    en: 'Withdrawal successful!',
  },
  'wallet.type': {
    uz: 'Turi',
    ru: 'Тип',
    en: 'Type',
  },
  'wallet.status': {
    uz: 'Holat',
    ru: 'Статус',
    en: 'Status',
  },
  'wallet.date': {
    uz: 'Sana',
    ru: 'Дата',
    en: 'Date',
  },
  'wallet.viewTx': {
    uz: "BscScan'da ko'rish",
    ru: 'Посмотреть на BscScan',
    en: 'View on BscScan',
  },
  'wallet.typeDeposit': {
    uz: 'Depozit',
    ru: 'Депозит',
    en: 'Deposit',
  },
  'wallet.typeWithdraw': {
    uz: 'Yechish',
    ru: 'Вывод',
    en: 'Withdraw',
  },
  'wallet.typePayout': {
    uz: "To'lov",
    ru: 'Выплата',
    en: 'Payout',
  },
  'wallet.typeRefund': {
    uz: 'Qaytarish',
    ru: 'Возврат',
    en: 'Refund',
  },
  'wallet.statusSuccess': {
    uz: 'Bajarildi',
    ru: 'Успешно',
    en: 'Success',
  },
  'wallet.statusPending': {
    uz: 'Kutilmoqda',
    ru: 'В ожидании',
    en: 'Pending',
  },
  'wallet.statusFailed': {
    uz: 'Xatolik',
    ru: 'Ошибка',
    en: 'Failed',
  },
  'wallet.securityTitle': {
    uz: 'Xavfsizlik maslahatlari',
    ru: 'Советы по безопасности',
    en: 'Security Tips',
  },
  'wallet.securityTip1': {
    uz: 'Seka Svara har bir tranzaksiya uchun escrow aqlli shartnomalaridan foydalanadi.',
    ru: 'Seka Svara использует escrow смарт-контракты для каждой транзакции.',
    en: 'Seka Svara uses escrow smart contracts for every transaction.',
  },
  'wallet.securityTip2': {
    uz: "Sizning shaxsiy kalitlaringiz hech qachon serverlarimizda saqlanmaydi.",
    ru: 'Ваши приватные ключи никогда не хранятся на наших серверах.',
    en: 'Your private keys are never stored on our servers.',
  },
  'wallet.securityTip3': {
    uz: "O'yindan oldin gaz uchun BNB borligiga ishonch hosil qiling.",
    ru: 'Убедитесь, что у вас есть BNB для газа перед игрой.',
    en: 'Ensure you have BNB for gas before playing.',
  },
  'wallet.platformFee': {
    uz: 'Platforma komissiyasi: 5%',
    ru: 'Комиссия платформы: 5%',
    en: 'Platform fee: 5% will be applied',
  },
  
  // Profile
  'profile.title': {
    uz: 'Profil',
    ru: 'Профиль',
    en: 'Profile',
  },
  'profile.edit': {
    uz: 'Tahrirlash',
    ru: 'Редактировать',
    en: 'Edit Profile',
  },
  'profile.uid': {
    uz: 'Foydalanuvchi ID',
    ru: 'ID пользователя',
    en: 'User ID',
  },
  'profile.joined': {
    uz: "Qo'shilgan sana",
    ru: 'Дата регистрации',
    en: 'Joined',
  },
  'profile.stats': {
    uz: 'Statistika',
    ru: 'Статистика',
    en: 'Stats',
  },
  'profile.games': {
    uz: "O'yinlar",
    ru: 'Игры',
    en: 'Games',
  },
  'profile.wins': {
    uz: "G'alabalar",
    ru: 'Победы',
    en: 'Wins',
  },
  'profile.winrate': {
    uz: "G'alaba %",
    ru: '% побед',
    en: 'Win Rate',
  },
  'profile.totalWinnings': {
    uz: 'Umumiy yutuq (USDT)',
    ru: 'Всего выигрышей (USDT)',
    en: 'Total Winnings',
  },
  'profile.highestStake': {
    uz: 'Eng katta tikish',
    ru: 'Макс ставка',
    en: 'Highest Stake',
  },
  'profile.longestStreak': {
    uz: 'Eng uzun seriya',
    ru: 'Самая длинная серия',
    en: 'Longest Streak',
  },
  'profile.recent': {
    uz: "So'nggi o'yinlar",
    ru: 'Недавние игры',
    en: 'Recent Games',
  },
  'profile.result.win': {
    uz: "G'alaba",
    ru: 'Победа',
    en: 'Win',
  },
  'profile.result.loss': {
    uz: 'Yutqazdi',
    ru: 'Поражение',
    en: 'Loss',
  },
  'profile.result.refund': {
    uz: 'Refund',
    ru: 'Возврат',
    en: 'Refund',
  },
  'profile.security': {
    uz: 'Xavfsizlik',
    ru: 'Безопасность',
    en: 'Security',
  },
  'profile.2fa': {
    uz: 'Ikki bosqichli tasdiq',
    ru: 'Двухфакторная',
    en: 'Two-Factor Auth',
  },
  'profile.devices': {
    uz: 'Qurilmalar',
    ru: 'Устройства',
    en: 'Devices',
  },
  'profile.connections': {
    uz: 'Ulangan hamyonlar',
    ru: 'Подключенные кошельки',
    en: 'Connected Wallets',
  },
  'profile.referrals': {
    uz: 'Referallar',
    ru: 'Рефералы',
    en: 'Referrals',
  },
  'profile.copyLink': {
    uz: 'Linkni nusxalash',
    ru: 'Скопировать ссылку',
    en: 'Copy Link',
  },
  'profile.logout': {
    uz: 'Chiqish',
    ru: 'Выйти',
    en: 'Logout',
  },
  'profile.delete': {
    uz: "Hisobni o'chirish",
    ru: 'Удалить аккаунт',
    en: 'Delete Account',
  },
  'profile.emptyRecent': {
    uz: "Hali o'yin yo'q",
    ru: 'Пока нет игр',
    en: 'No games yet',
  },
  'profile.emptyRecentDesc': {
    uz: "Lobby'dan o'ynashni boshlang",
    ru: 'Начните играть с Lobby',
    en: 'Start playing from Lobby',
  },
  'profile.copyWallet': {
    uz: 'Hamyonni nusxalash',
    ru: 'Скопировать кошелек',
    en: 'Copy Wallet',
  },
  'profile.viewBscscan': {
    uz: "BscScan'da ko'rish",
    ru: 'Посмотреть на BscScan',
    en: 'View on BscScan',
  },
  'profile.nickname': {
    uz: 'Taxallus',
    ru: 'Никнейм',
    en: 'Nickname',
  },
  'profile.bio': {
    uz: 'Haqida',
    ru: 'О себе',
    en: 'Bio',
  },
  'profile.avatar': {
    uz: 'Avatar',
    ru: 'Аватар',
    en: 'Avatar',
  },
  'profile.changeAvatar': {
    uz: 'Avatarni o\'zgartirish',
    ru: 'Изменить аватар',
    en: 'Change Avatar',
  },
  'profile.connectWallet': {
    uz: 'Hamyonni ulash',
    ru: 'Подключить кошелек',
    en: 'Connect Wallet',
  },
  'profile.connectAnother': {
    uz: 'Boshqa hamyon ulash',
    ru: 'Подключить другой кошелек',
    en: 'Connect Another Wallet',
  },
  'profile.primaryWallet': {
    uz: 'Asosiy hamyon',
    ru: 'Основной кошелек',
    en: 'Primary Wallet',
  },
  'profile.privacy': {
    uz: 'Maxfiylik',
    ru: 'Конфиденциальность',
    en: 'Privacy',
  },
  'profile.showProfile': {
    uz: 'Profilni boshqalarga ko\'rsatish',
    ru: 'Показывать профиль другим',
    en: 'Show profile to others',
  },
  'profile.referralLink': {
    uz: 'Referal havola',
    ru: 'Реферальная ссылка',
    en: 'Referral Link',
  },
  'profile.invites': {
    uz: 'Takliflar',
    ru: 'Приглашения',
    en: 'Invites Sent',
  },
  'profile.signups': {
    uz: "Ro'yxatdan o'tganlar",
    ru: 'Регистраций',
    en: 'Sign-ups',
  },
  'profile.bonus': {
    uz: 'Bonus USDT',
    ru: 'Бонус USDT',
    en: 'Bonus USDT',
  },
  'profile.share': {
    uz: 'Referalni ulashish',
    ru: 'Поделиться рефералом',
    en: 'Share Referral',
  },
  'profile.settings': {
    uz: 'Sozlamalar',
    ru: 'Настройки',
    en: 'Settings',
  },
  'profile.quickSettings': {
    uz: 'Tezkor sozlamalar',
    ru: 'Быстрые настройки',
    en: 'Quick Settings',
  },
  'profile.language': {
    uz: 'Til',
    ru: 'Язык',
    en: 'Language',
  },
  'profile.theme': {
    uz: 'Mavzu',
    ru: 'Тема',
    en: 'Theme',
  },
  'profile.dark': {
    uz: 'Qorong\'i',
    ru: 'Темная',
    en: 'Dark',
  },
  'profile.notifications': {
    uz: 'Bildirishnomalar',
    ru: 'Уведомления',
    en: 'Notifications',
  },
  'profile.notifyWins': {
    uz: "G'alabalar",
    ru: 'Победы',
    en: 'Wins',
  },
  'profile.notifyDeposits': {
    uz: 'Depozitlar',
    ru: 'Депозиты',
    en: 'Deposits',
  },
  'profile.notifySystem': {
    uz: 'Tizim',
    ru: 'Система',
    en: 'System',
  },
  'profile.dangerZone': {
    uz: 'Xavfli zona',
    ru: 'Опасная зона',
    en: 'Danger Zone',
  },
  'profile.logoutAll': {
    uz: 'Barcha qurilmalardan chiqish',
    ru: 'Выйти со всех устройств',
    en: 'Logout All Devices',
  },
  'profile.deleteWarning': {
    uz: 'Bu harakat qaytarilmaydi. Barcha ma\'lumotlaringiz o\'chiriladi.',
    ru: 'Это действие необратимо. Все ваши данные будут удалены.',
    en: 'This action cannot be undone. All your data will be deleted.',
  },
  'profile.confirmDelete': {
    uz: 'Ha, hisobni o\'chirish',
    ru: 'Да, удалить аккаунт',
    en: 'Yes, Delete Account',
  },
  'profile.lastSeen': {
    uz: 'Oxirgi marta',
    ru: 'Последний раз',
    en: 'Last seen',
  },
  'profile.signOut': {
    uz: 'Chiqish',
    ru: 'Выйти',
    en: 'Sign Out',
  },
  'profile.gameDetails': {
    uz: 'Tafsilotlar',
    ru: 'Детали',
    en: 'Details',
  },
  'profile.copied': {
    uz: 'Nusxalandi!',
    ru: 'Скопировано!',
    en: 'Copied!',
  },
  
  // Settings
  'settings.title': {
    uz: 'Sozlamalar',
    ru: 'Настройки',
    en: 'Settings',
  },
  'settings.language': {
    uz: 'Til',
    ru: 'Язык',
    en: 'Language',
  },
  'settings.region': {
    uz: 'Hudud',
    ru: 'Регион',
    en: 'Region',
  },
  'settings.theme': {
    uz: 'Tema',
    ru: 'Тема',
    en: 'Theme',
  },
  'settings.dark': {
    uz: 'Qora',
    ru: 'Тёмная',
    en: 'Dark',
  },
  'settings.light': {
    uz: 'Oq',
    ru: 'Светлая',
    en: 'Light',
  },
  'settings.auto': {
    uz: 'Avto',
    ru: 'Авто',
    en: 'Auto',
  },
  'settings.animations': {
    uz: 'Animatsiyalar',
    ru: 'Анимации',
    en: 'Animations',
  },
  'settings.lowMotion': {
    uz: 'Kam harakat',
    ru: 'Низкое движение',
    en: 'Low motion',
  },
  'settings.fontSize': {
    uz: "Shrift o'lchami",
    ru: 'Размер шрифта',
    en: 'Font size',
  },
  'settings.small': {
    uz: 'Kichik',
    ru: 'Маленький',
    en: 'Small',
  },
  'settings.default': {
    uz: 'Standart',
    ru: 'Стандарт',
    en: 'Default',
  },
  'settings.large': {
    uz: 'Katta',
    ru: 'Большой',
    en: 'Large',
  },
  'settings.notifications': {
    uz: 'Bildirishnomalar',
    ru: 'Уведомления',
    en: 'Notifications',
  },
  'settings.wins': {
    uz: "G'alaba va to'lovlar",
    ru: 'Победы и выплаты',
    en: 'Wins & payouts',
  },
  'settings.payments': {
    uz: 'Depozit va chiqim',
    ru: 'Депозиты и вывод',
    en: 'Deposits & withdrawals',
  },
  'settings.system': {
    uz: 'Tizim yangilari',
    ru: 'Системные',
    en: 'System updates',
  },
  'settings.channel': {
    uz: 'Kanal',
    ru: 'Канал',
    en: 'Channel',
  },
  'settings.inapp': {
    uz: 'Ilova ichida',
    ru: 'В приложении',
    en: 'In-app',
  },
  'settings.email': {
    uz: 'Email',
    ru: 'Email',
    en: 'Email',
  },
  'settings.push': {
    uz: 'Push',
    ru: 'Push',
    en: 'Push',
  },
  'settings.quietHours': {
    uz: 'Sokin soatlar',
    ru: 'Тихие часы',
    en: 'Quiet hours',
  },
  'settings.security': {
    uz: 'Xavfsizlik',
    ru: 'Безопасность',
    en: 'Security',
  },
  'settings.2fa': {
    uz: 'Ikki bosqichli tasdiq',
    ru: 'Двухфакторная аутентификация',
    en: 'Two-Factor Auth',
  },
  'settings.sessions': {
    uz: 'Faol seanslar',
    ru: 'Активные сессии',
    en: 'Active sessions',
  },
  'settings.wallets': {
    uz: 'Ulangan hamyonlar',
    ru: 'Подключенные кошельки',
    en: 'Connected wallets',
  },
  'settings.privacy': {
    uz: 'Maxfiylik',
    ru: 'Приватность',
    en: 'Privacy',
  },
  'settings.showProfile': {
    uz: "Profilni ko'rsatish",
    ru: 'Показывать профиль',
    en: 'Show profile',
  },
  'settings.game': {
    uz: "O'yin sozlamalari",
    ru: 'Настройки игры',
    en: 'Game settings',
  },
  'settings.stakePresets': {
    uz: 'Standart stavkalar',
    ru: 'Предустановки ставок',
    en: 'Stake presets',
  },
  'settings.gasTip': {
    uz: 'Gaz uchun ≥0.005 BNB saqlang',
    ru: 'Держите ≥0.005 BNB для газа',
    en: 'Keep ≥0.005 BNB for gas',
  },
  'settings.currency': {
    uz: "Valyuta ko'rsatish",
    ru: 'Отображение валюты',
    en: 'Currency display',
  },
  'settings.cache': {
    uz: "Kesh va ma'lumotlar",
    ru: 'Кэш и данные',
    en: 'Cache & data',
  },
  'settings.clearCache': {
    uz: 'Keshni tozalash',
    ru: 'Очистить кэш',
    en: 'Clear cache',
  },
  'settings.resetLocal': {
    uz: 'Mahalliy sozlamalarni tiklash',
    ru: 'Сброс локальных настроек',
    en: 'Reset local settings',
  },
  'settings.legal': {
    uz: 'Huquqiy hujjatlar',
    ru: 'Юр. документы',
    en: 'Legal',
  },
  'settings.terms': {
    uz: 'Foydalanish shartlari',
    ru: 'Условия использования',
    en: 'Terms of Service',
  },
  'settings.privacyPolicy': {
    uz: 'Maxfiylik siyosati',
    ru: 'Политика конфиденциальности',
    en: 'Privacy Policy',
  },
  'settings.fairPlay': {
    uz: "Adolatli o'yin",
    ru: 'Fair Play',
    en: 'Fair Play',
  },
  'settings.risk': {
    uz: 'Xavf ogohlantirishi',
    ru: 'Уведомление о рисках',
    en: 'Risk Disclosure',
  },
  'settings.support': {
    uz: 'Yordam va aloqa',
    ru: 'Поддержка',
    en: 'Support',
  },
  'settings.contact': {
    uz: "Qo'llab-quvvatlash bilan aloqa",
    ru: 'Связаться с поддержкой',
    en: 'Contact support',
  },
  'settings.faq': {
    uz: 'Savol-javob',
    ru: 'FAQ',
    en: 'FAQ',
  },
  'settings.version': {
    uz: 'Versiya',
    ru: 'Версия',
    en: 'Version',
  },
  'settings.changelog': {
    uz: "O'zgarishlar tarixi",
    ru: 'Список изменений',
    en: 'Changelog',
  },
  'settings.logout': {
    uz: 'Chiqish',
    ru: 'Выйти',
    en: 'Logout',
  },
  'settings.logoutAll': {
    uz: 'Hamma qurilmalardan chiqish',
    ru: 'Выйти на всех устройствах',
    en: 'Log out of all devices',
  },
  'settings.delete': {
    uz: "Hisobni o'chirish",
    ru: 'Удалить аккаунт',
    en: 'Delete account',
  },
  'settings.saved': {
    uz: 'Saqlandi',
    ru: 'Сохранено',
    en: 'Saved',
  },
  'settings.confirm': {
    uz: 'Tasdiqlaysizmi?',
    ru: 'Подтвердить?',
    en: 'Confirm?',
  },
  'settings.clearCacheConfirm': {
    uz: 'Keshni tozalashni tasdiqlaysizmi?',
    ru: 'Подтвердить очистку кэша?',
    en: 'Confirm clearing cache?',
  },
  'settings.resetConfirm': {
    uz: 'Sozlamalarni tiklashni tasdiqlaysizmi?',
    ru: 'Подтвердить сброс настроек?',
    en: 'Confirm resetting settings?',
  },
  'settings.deleteConfirm': {
    uz: "Hisobingizni o'chirishni tasdiqlaysizmi? Bu amal qaytarilmaydi.",
    ru: 'Подтвердить удаление аккаунта? Это действие необратимо.',
    en: 'Confirm account deletion? This action cannot be undone.',
  },
  'settings.legalFooter': {
    uz: "Mahalliy qonunlaringizga muvofiqligini ta'minlang.",
    ru: 'Убедитесь в соответствии с вашими местными законами.',
    en: 'Ensure compliance with your local laws.',
  },
  'settings.on': {
    uz: 'Yoniq',
    ru: 'Вкл',
    en: 'On',
  },
  'settings.off': {
    uz: "O'chiq",
    ru: 'Выкл',
    en: 'Off',
  },
  'settings.displaySettings': {
    uz: "Ko'rinish sozlamalari",
    ru: 'Настройки отображения',
    en: 'Display settings',
  },
  'settings.gamePayments': {
    uz: "O'yin va to'lovlar",
    ru: 'Игра и платежи',
    en: 'Game & Payments',
  },
  'settings.about': {
    uz: 'Haqida',
    ru: 'О программе',
    en: 'About',
  },
  'settings.dangerZone': {
    uz: 'Xavfli zona',
    ru: 'Опасная зона',
    en: 'Danger Zone',
  },
  'settings.connectWallet': {
    uz: 'Hamyon ulash',
    ru: 'Подключить кошелек',
    en: 'Connect wallet',
  },
  'settings.disconnect': {
    uz: "Ulanishni uzish",
    ru: 'Отключить',
    en: 'Disconnect',
  },
  'settings.showFiat': {
    uz: "Fiat qiymatini ko'rsatish",
    ru: 'Показать фиатное значение',
    en: 'Show fiat value',
  },
} as const;

export function useTranslation(lang: Language) {
  return (key: keyof typeof translations): string => {
    return translations[key]?.[lang] || key;
  };
}
