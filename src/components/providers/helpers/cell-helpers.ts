// Імпортуємо типи Field, CellState та Cell із модуля типів
import { Field, CellState, Cell } from '@/types';

// Функція перевіряє, чи є на полі хоча б одна зайнята (occupied) клітинка
// Параметр field: двовимірний масив (ігрове поле), що містить рядки та клітинки
// Повертає boolean: true, якщо є хоча б одна зайнята клітинка, інакше false
export const checkOccupiedCells = (field: Field): boolean => {
  // Використовуємо some для перевірки кожного рядка поля
  // Якщо хоча б в одному рядку є клітинка зі станом occupied, повертається true
  return field.some(row =>
      // Перевіряємо кожну клітинку в рядку
      row.some(cell => cell.state === CellState.occupied)
  );
};

// Функція перевіряє, чи корабель повністю знищений (усі його клітинки мають стан hit)
// Параметр shipCells: масив клітинок, які належать до одного корабля
// Повертає boolean: true, якщо всі клітинки корабля мають стан hit, інакше false
export const checkIsShipDestroyed = (shipCells: Cell[]): boolean => {
  // Якщо масив клітинок порожній, корабель вважається не знищеним
  if (shipCells.length === 0) {
    return false;
  }

  // Перевіряємо, чи кожна клітинка корабля має стан hit
  // Використовуємо every, щоб переконатися, що всі клітинки відповідають умові
  return shipCells.every(cell => cell.state === CellState.hit);
};