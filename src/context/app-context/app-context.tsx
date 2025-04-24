// Імпорт createContext з React для створення контексту
import { createContext } from 'react';

// Імпорт типів, які описують ігрову логіку та структуру
import { Field, FieldConfig, Orientation, Player, Winner } from '@/types';

// Створення контексту гри з передачею типізованих значень
const AppContext = createContext<{
  // Хто зараз ходить: користувач чи комп’ютер
  currentPlayer: Player;

  // Хто виграв гру, або null, якщо гра ще триває
  winner: Winner | null;

  // Поле користувача (двовимірний масив клітинок)
  userField: Field;

  // Поле комп’ютера
  computerField: Field;

  // Скидання гри до початкового стану
  resetGame: () => void;

  // Генерація випадкового розміщення кораблів для користувача
  generateRandomPlayerField: () => void;

  // Генерація випадкового розміщення кораблів для комп’ютера
  generateRandomComputerField: () => void;

  // Очищення поля користувача (видалення всіх кораблів)
  clearUserField: () => void;

  // Обробка кліку по полі комп’ютера (атака)
  onComputerFieldClick: (event: React.MouseEvent<HTMLButtonElement>) => void;

  // Конфігурація поля (наприклад, розмір, тип розмітки)
  fieldConfig: FieldConfig;

  // Зміна розміру поля (наприклад, 10x10, 8x8 тощо)
  changeFieldSize: (size: number) => void;

  // Розміщення корабля вручну на полі користувача
  placeShip: (
      row: number, // Рядок, де починається корабель
      col: number, // Колонка, де починається корабель
      size: number, // Довжина корабля
      orientation: Orientation // Орієнтація корабля: горизонтальна / вертикальна
  ) => void;

  // Видалення корабля за координатами клітинки
  deleteShip: (row: number, col: number) => void;
}>(null!); // Використовуємо `null!`, щоб обійти перевірку TypeScript на null, оскільки context буде ініціалізований пізніше

// Експортуємо контекст для використання в інших компонентах через useContext(AppContext)
export default AppContext;
