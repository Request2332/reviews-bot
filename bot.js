// Конфигурация
const config = {
  token: "8356001981:AAF-mCQXvLyslg8wGrpRJ4MShqc7BUS3FGI",
  supabaseUrl: "https://gcknpwalldmkalpprgvt.supabase.co",
  supabaseKey: "sb_publishable_FDMWVwCUPQ5zXiMWewS7OQ_O5qw3dDy",
  channelId: "-1003584450166",
  adminId: 8114725195,
  bankCard: "2200701381940615 Т-банк",
  cryptoBot: "https://t.me/CryptoBot?start=IVnFMeWgEkSE"
};

// Генерация кода
function generateCode() {
  return "REW" + Math.floor(10000000 + Math.random() * 90000000);
}

// Главное меню
const mainMenu = {
  keyboard: [
    [{ text: "💰 Баланс" }, { text: "💳 Пополнить" }],
    [{ text: "📝 Создать задание" }, { text: "💼 Взять задание" }],
    [{ text: "💸 Вывести" }, { text: "🆘 Помощь" }]
  ],
  resize_keyboard: true
};

// Стартовая команда
bot.command("start", async (ctx) => {
  const user = ctx.from;
  const name = user.first_name || "Пользователь";
  
  await ctx.replyWithHTML(
    👋 <b>Привет, ${name}!</b>\n\n +
    <b>ОтзывыPRO</b> - заработок на отзывах\n\n +
    <b>Для заказчиков:</b>\n +
    • Размещение заданий от 150₽\n +
    • Гарантия выполнения\n\n +
    <b>Для исполнителей:</b>\n +
    • Задания от 50₽ за отзыв\n +
    • Вывод от 500₽\n\n +
    <b>Выберите действие:</b>,
    { reply_markup: mainMenu }
  );
});

// Пополнение баланса
bot.hears("💳 Пополнить", async (ctx) => {
  const code = generateCode();
  
  const message = 
    💳 <b>Пополнение баланса</b>\n\n +
    <b>1. Переведите на карту:</b>\n +
    <code>${config.bankCard}</code>\n\n +
    <b>2. В комментарии укажите:</b>\n +
    <code>${code}</code>\n\n +
    <b>3. Криптовалюта:</b>\n +
    TON/USDT: ${config.cryptoBot}\n\n +
    <b>4. После оплаты нажмите:</b>\n +
    ✅ Я оплатил\n\n +
    <b>Ваш код:</b> <code>${code}</code>;
  
  const keyboard = {
    inline_keyboard: [
      [{ text: "✅ Я оплатил", callback_data: deposit_${code} }],
      [{ text: "❌ Отмена", callback_data: "cancel_deposit" }]
    ]
  };
  
  await ctx.replyWithHTML(message, { reply_markup: keyboard });
});

// Обработка колбэков
bot.on("callback_query", async (ctx) => {
  const data = ctx.callbackQuery.data;
  
  if (data.startsWith("deposit_")) {
    const code = data.replace("deposit_", "");
    const user = ctx.from;
    
    // Отправляем в канал
    const channelMsg = 
      💰 <b>НОВЫЙ ДЕПОЗИТ</b>\n\n +
      👤 <b>Пользователь:</b> ${user.first_name}\n +
      🆔 <b>ID:</b> <code>${user.id}</code>\n +
      🔢 <b>Код:</b> <code>${code}</code>\n\n +
      <i>Ожидает подтверждения</i>;
    
    await ctx.telegram.sendMessage(config.channelId, channelMsg, {
      parse_mode: "HTML"
    });
    
    await ctx.answerCbQuery(✅ Заявка отправлена! Код: ${code});
    await ctx.replyWithHTML(
      ✅ <b>Заявка отправлена!</b>\n\n +
      <b>Код:</b> <code>${code}</code>\n +
      Админ проверит в течение 15 минут.
    );
    
  } else if (data === "cancel_deposit") {
    await ctx.deleteMessage();
    await ctx.answerCbQuery("❌ Отменено");
  }
});

// Баланс
bot.hears("💰 Баланс", async (ctx) => {
  await ctx.replyWithHTML(
    💰 <b>Ваш баланс</b>\n\n +
    💵 Доступно: <b>0₽</b>\n +
    💸 Минимальный вывод: <b>500₽</b>\n\n +
    Пополните баланс для начала работы.
  );
});

// Помощь
bot.hears("🆘 Помощь", async (ctx) => {
  await ctx.replyWithHTML(
    🆘 <b>Помощь по боту</b>\n\n +
    <b>Пополнение баланса:</b>\n +
    ⚠️ ОБЯЗАТЕЛЬНО указывайте код в комментарии!\n +
    Без кода перевод не будет зачислен.\n\n +
    <b>Вывод средств:</b>\n +
    • Минимум 500₽\n +
    • Вывод в течение 24 часов\n\n +
    <b>Техподдержка:</b>\n +
    @твой_username
  );
});

console.log("🤖 Бот запущен на Teletype!");
