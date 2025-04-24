// Імпортуємо типи для клітинок, станів клітинок і ігрового поля
import { Cell, CellState, Field } from '@/types';

// Допоміжна функція для генерації випадкового індексу в межах розміру поля
// Параметр fieldSize: розмір поля (кількість рядків або стовпців)
// Повертає number: випадкове ціле число від 0 до fieldSize - 1
const getRandomIndex = (fieldSize: number) =>
    Math.floor(Math.random() * fieldSize);

// Функція визначає клітинку для пострілу штучного інтелекту (AI) на полі гравця
// Параметр userField: ігрове поле гравця (двовимірний масив клітинок)
// Повертає Cell: клітинку, в яку AI вирішив стріляти
export const getAiShot = (userField: Field): Cell => {
  // Змінні для зберігання координат обраної клітинки
  let rowI, colJ;

  // Отримуємо розмір поля (кількість стовпців у першому рядку)
  const fieldSize = userField[0].length;

  // Допоміжна функція для перевірки, чи координати клітинки в межах поля
  // Параметри row, col: координати рядка і стовпця
  // Повертає boolean: true, якщо клітинка в межах поля, інакше false
  const isInBounds = (row: number, col: number) =>
      row >= 0 && row < userField.length && col >= 0 && col < userField[0].length;

  // Допоміжна функція для пошуку частково пошкодженого корабля
  // Повертає Cell | null: клітинку для пострілу поруч із пошкодженою або null, якщо такої немає
  const findPartiallyHitShip = () => {
    // Проходимо по всіх клітинках поля
    for (let row = 0; row < userField.length; row++) {
      for (let col = 0; col < userField[row].length; col++) {
        const cell = userField[row][col];
        // Якщо клітинка має стан hit (пошкоджена частина корабля)
        if (cell.state === CellState.hit) {
          // Визначаємо можливі напрямки для перевірки сусідніх клітинок
          const directions = [
            [-1, 0], // вгору
            [1, 0], // вниз
            [0, -1], // вліво
            [0, 1], // вправо
          ];
          // Перемішуємо напрямки випадковим чином для непередбачуваності
          const shuffledDirections = [...directions].sort(
              () => Math.random() - 0.5
          );

          // Перевіряємо сусідні клітинки в перемішаному порядку
          for (const [dx, dy] of shuffledDirections) {
            const newRow = row + dx;
            const newCol = col + dy;

            // Якщо сусідня клітинка в межах поля і є порожньою або зайнятою
            if (
                isInBounds(newRow, newCol) &&
                (userField[newRow][newCol].state === CellState.empty ||
                    userField[newRow][newCol].state === CellState.occupied)
            ) {
              // Повертаємо цю клітинку для пострілу
              return userField[newRow][newCol];
            }
          }
        }
      }
    }
    // Якщо частково пошкоджений корабель не знайдено, повертаємо null
    return null;
  };

  // Спочатку намагаємося знайти клітинку поруч із частково пошкодженим кораблем
  const partialHitCell = findPartiallyHitShip();
  if (partialHitCell) {
    // Якщо така клітинка є, повертаємо її для пострілу
    return partialHitCell;
  }

  // Якщо частково пошкоджених кораблів немає, обираємо випадкову клітинку
  do {
    // Генеруємо випадкові координати
    rowI = getRandomIndex(fieldSize);
    colJ = getRandomIndex(fieldSize);
    // Повторюємо, поки не знайдемо клітинку, яка не була обстріляна (не missed або hit)
  } while (
      userField[rowI][colJ].state === CellState.missed ||
      userField[rowI][colJ].state === CellState.hit
      );

  // Повертаємо обрану випадкову клітинку
  return userField[rowI][colJ];
};