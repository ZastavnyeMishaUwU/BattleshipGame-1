// Імпортуємо тип для орієнтації корабля
import { Orientation } from '@/types';
// Імпортуємо React-хуки для керування станом і побічними ефектами
import { useEffect, useState } from 'react';

// Визначаємо кастомний хук useOrientation для керування орієнтацією корабля
// Повертає об'єкт із поточною орієнтацією та функцією для її зміни
export const useOrientation = () => {
  // Стан для зберігання поточної орієнтації корабля (за замовчуванням горизонтальна)
  const [orientation, setOrientation] = useState<Orientation>(
      Orientation.horizontal
  );

  // Використовуємо useEffect для обробки натискання клавіші пробілу
  useEffect(() => {
    // Обробник натискання клавіші
    const handleKeyDown = (e: KeyboardEvent) => {
      // Якщо натиснуто пробіл
      if (e.code === 'Space') {
        e.preventDefault(); // Запобігаємо стандартній поведінці (наприклад, прокрутці)
        // Змінюємо орієнтацію на протилежну
        setOrientation(prev =>
            prev === Orientation.horizontal
                ? Orientation.vertical
                : Orientation.horizontal
        );
      }
    };

    // Додаємо слухач події keydown
    window.addEventListener('keydown', handleKeyDown);
    // Очищаємо слухач при розмонтуванні компонента
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Порожній масив залежностей, щоб ефект виконався лише один раз

  // Функція для ручної зміни орієнтації
  const toggleOrientation = () => {
    // Змінюємо орієнтацію на протилежну
    setOrientation(prev =>
        prev === Orientation.horizontal
            ? Orientation.vertical
            : Orientation.horizontal
    );
  };

  // Повертаємо поточну орієнтацію та функцію для її зміни
  return { orientation, toggleOrientation };
};