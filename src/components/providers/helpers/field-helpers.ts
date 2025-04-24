// Імпортуємо типи для роботи з полем, клітинками, станами, конфігурацією поля та орієнтацією кораблів
import { Field, Cell, CellState, FieldConfig, Orientation } from '@/types';

// Функція створює порожнє ігрове поле заданого розміру
// Параметр size: розмір поля (за замовчуванням 10x10)
// Повертає Field: двовимірний масив із клітинками зі станом empty
export function initializeEmptyField(size: number = 10): Field {
  // Ініціалізуємо порожній масив для поля
  const field: Field = [];
  // Створюємо рядки
  for (let i = 0; i < size; i++) {
    // Ініціалізуємо масив для клітинок у рядку
    const row: Cell[] = [];
    // Заповнюємо рядок клітинками зі станом empty
    for (let j = 0; j < size; j++) {
      row.push({ row: i, col: j, state: CellState.empty });
    }
    // Додаємо рядок до поля
    field.push(row);
  }
  return field;
}

// Функція розміщує корабель на полі, змінюючи стани відповідних клітинок
// Параметри:
// - field: ігрове поле
// - row: початковий рядок для розміщення корабля
// - col: початковий стовпець для розміщення корабля
// - deck: кількість палуб (розмір корабля)
// - orientation: орієнтація корабля (горизонтальна чи вертикальна)
// Без повернення значення (змінює поле напряму)
function placeShip(
    field: Field,
    row: number,
    col: number,
    deck: number,
    orientation: Orientation
): void {
  // Проходимо по всіх палубах корабля
  for (let i = 0; i < deck; i++) {
    // Визначаємо координати клітинки залежно від орієнтації
    const newRow = orientation === Orientation.vertical ? row + i : row;
    const newCol = orientation === Orientation.horizontal ? col + i : col;
    // Позначуємо клітинку як зайняту (occupied)
    field[newRow][newCol].state = CellState.occupied;
  }
}

// Функція генерує ігрове поле з випадково розміщеними кораблями
// Параметр config: об'єкт із розміром поля (fieldSize) та конфігурацією кораблів (ships)
// Повертає Field: поле з розміщеними кораблями
export function generateShips({ fieldSize, ships }: FieldConfig): Field {
  // Створюємо порожнє поле заданого розміру
  const field: Field = initializeEmptyField(fieldSize);

  // Проходимо по кожному типу корабля (кількість палуб і кількість кораблів)
  for (const [deck, count] of ships) {
    // Розміщуємо кожен корабель заданого типу
    for (let k = 0; k < count; k++) {
      // Випадково обираємо орієнтацію (горизонтальна або вертикальна)
      const orientation =
          Math.random() < 0.5 ? Orientation.horizontal : Orientation.vertical;
      let placed = false;
      // Спробуємо розмістити корабель, поки не вдасться
      while (!placed) {
        // Випадково обираємо початкові координати
        const row = Math.floor(Math.random() * fieldSize);
        const col = Math.floor(Math.random() * fieldSize);
        // Перевіряємо, чи можна розмістити корабель
        if (canPlaceShip(field, row, col, deck, orientation)) {
          // Якщо можна, розміщуємо корабель
          placeShip(field, row, col, deck, orientation);
          placed = true;
        }
      }
    }
  }

  return field;
}

// Функція перевіряє, чи можна розмістити корабель у вказаній позиції
// Параметри:
// - field: ігрове поле
// - row: початковий рядок
// - col: початковий стовпець
// - deck: кількість палуб корабля
// - orientation: орієнтація корабля
// Повертає boolean: true, якщо розміщення можливе, інакше false
export function canPlaceShip(
    field: Field,
    row: number,
    col: number,
    deck: number,
    orientation: Orientation
): boolean {
  // Отримуємо розмір поля
  const fieldSize = field.length;
  // Перевіряємо, чи корабель не виходить за межі поля
  if (orientation === Orientation.horizontal && col + deck > fieldSize)
    return false;
  if (orientation === Orientation.vertical && row + deck > fieldSize)
    return false;

  // Перевіряємо кожну палубу корабля
  for (let i = 0; i < deck; i++) {
    // Визначаємо координати поточної клітинки
    const newRow = orientation === Orientation.vertical ? row + i : row;
    const newCol = orientation === Orientation.horizontal ? col + i : col;

    // Якщо клітинка не порожня, розміщення неможливе
    if (field[newRow][newCol].state !== CellState.empty) return false;

    // Перевіряємо сусідні клітинки, щоб забезпечити відстань між кораблями
    for (let r = newRow - 1; r <= newRow + 1; r++) {
      for (let c = newCol - 1; c <= newCol + 1; c++) {
        // Перевіряємо, чи координати в межах поля
        if (
            r >= 0 &&
            r < fieldSize &&
            c >= 0 &&
            c < fieldSize &&
            // Якщо сусідня клітинка не порожня, розміщення неможливе
            field[r][c].state !== CellState.empty
        ) {
          return false;
        }
      }
    }
  }

  // Якщо всі перевірки пройдено, розміщення можливе
  return true;
}