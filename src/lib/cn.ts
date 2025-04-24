// Імпортуємо тип ClassValue — тип, який приймає clsx (рядок, об'єкт, масив тощо)
import { ClassValue } from 'clsx';

// Імпортуємо саму утиліту clsx — вона конвертує аргументи у валідний className
import { clsx } from 'clsx';

// Імпортуємо twMerge — утиліта, яка об'єднує Tailwind класи, прибираючи дублікати та конфлікти
import { twMerge } from 'tailwind-merge';

// Експортуємо функцію cn, яка:
// 1. Приймає довільну кількість className аргументів (рядки, масиви, об’єкти тощо)
// 2. Обробляє їх через clsx (для формування єдиного рядка класів)
// 3. Обробляє результат через twMerge (щоб уникнути конфліктів класів, наприклад: 'p-2 p-4' → 'p-4')
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
