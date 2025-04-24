// Функція sleep — створює паузу на задану кількість мілісекунд
// Використовується в async-функціях для затримки логіки (наприклад, між анімаціями або кроками бота)
export const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));