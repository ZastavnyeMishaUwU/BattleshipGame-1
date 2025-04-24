// Імпортуємо типи для станів клітинок, клітинок і ігрового поля
import { CellState, Cell, Field } from '@/types';

// Функція позначає сусідні клітинки знищеного корабля як промах (missed)
// Параметри:
// - shipCells: масив клітинок, що належать до знищеного корабля
// - field: ігрове поле (двовимірний масив клітинок)
// Без повернення значення (змінює поле напряму)
export const markMissedAdjacentCells = (shipCells: Cell[], field: Field) => {
  // Визначаємо зміщення для всіх сусідніх клітинок (включаючи діагоналі)
  const adjacentOffsets = [
    { row: -1, col: 0 }, // вгору
    { row: 1, col: 0 }, // вниз
    { row: 0, col: -1 }, // вліво
    { row: 0, col: 1 }, // вправо
    { row: -1, col: -1 }, // вгору-вліво (діагональ)
    { row: -1, col: 1 }, // вгору-вправо (діагональ)
    { row: 1, col: -1 }, // вниз-вліво (діагональ)
    { row: 1, col: 1 }, // вниз-вправо (діагональ)
  ];

  // Проходимо по кожній клітинці знищеного корабля
  for (const cell of shipCells) {
    // Перевіряємо всі сусідні клітинки за визначеними зміщеннями
    for (const offset of adjacentOffsets) {
      // Обчислюємо координати сусідньої клітинки
      const adjacentRow = cell.row + offset.row;
      const adjacentCol = cell.col + offset.col;

      // Перевіряємо, чи сусідня клітинка:
      // - у межах поля
      // - не має стану hit (оскільки hit-клітинки належать кораблю)
      if (
          adjacentRow >= 0 &&
          adjacentRow < field.length &&
          adjacentCol >= 0 &&
          adjacentCol < field[0].length &&
          field[adjacentRow][adjacentCol].state !== CellState.hit
      ) {
        // Позначуємо сусідню клітинку як промах (missed)
        field[adjacentRow][adjacentCol].state = CellState.missed;
      }
    }
  }
};