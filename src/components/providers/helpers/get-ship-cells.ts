// Імпортуємо типи для станів клітинок, клітинок і ігрового поля
import { CellState, Cell, Field } from '@/types';

// Функція знаходить усі клітинки, що належать до корабля, починаючи з заданої клітинки
// Параметри:
// - cell: початкова клітинка, яка належить кораблю
// - field: ігрове поле (двовимірний масив клітинок)
// Повертає Cell[]: масив клітинок, що складають корабель
export const getShipCells = (cell: Cell, field: Field): Cell[] => {
  // Ініціалізуємо масив для зберігання клітинок корабля
  const shipCells: Cell[] = [];
  // Створюємо двовимірний масив для відстеження перевірених клітинок
  // Заповнюємо його значеннями false (кожна клітинка ще не перевірена)
  const checked: boolean[][] = new Array(field.length)
      .fill(0)
      .map(() => new Array(field[0].length).fill(false));

  // Рекурсивна функція для перевірки сусідніх клітинок
  // Параметри row, col: координати поточної клітинки
  // Без повернення значення (змінює shipCells і checked)
  const checkAdjacentCells = (row: number, col: number) => {
    // Перевіряємо, чи координати в межах поля і чи клітинка ще не перевірена
    if (
        row < 0 ||
        row >= field.length ||
        col < 0 ||
        col >= field[0].length ||
        checked[row][col]
    ) {
      return;
    }

    // Позначуємо клітинку як перевірену
    checked[row][col] = true;

    // Якщо клітинка є частиною корабля (зайнята або пошкоджена)
    if (
        field[row][col].state === CellState.occupied ||
        field[row][col].state === CellState.hit
    ) {
      // Додаємо клітинку до масиву корабля
      shipCells.push(field[row][col]);

      // Визначаємо сусідні клітинки (вгору, вниз, вліво, вправо)
      const adjacentOffsets = [
        { row: -1, col: 0 }, // вгору
        { row: 1, col: 0 }, // вниз
        { row: 0, col: -1 }, // вліво
        { row: 0, col: 1 }, // вправо
      ];

      // Рекурсивно перевіряємо кожну сусідню клітинку
      for (const offset of adjacentOffsets) {
        const adjacentRow = row + offset.row;
        const adjacentCol = col + offset.col;
        checkAdjacentCells(adjacentRow, adjacentCol);
      }
    }
  };

  // Починаємо перевірку з координат заданої клітинки
  checkAdjacentCells(cell.row, cell.col);
  // Повертаємо масив клітинок, що належать до корабля
  return shipCells;
};