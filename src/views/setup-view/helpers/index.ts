// Імпортуємо типи: поле, стани клітинок та конфігурацію кораблів
import { Field, CellState, ShipsConfig } from '../../../types';

// Функція підраховує кількість кораблів різної довжини на полі
export const getShipCount = (field: Field): Map<number, number> => {
  const shipCounts = new Map<number, number>(); // Ключ — довжина корабля, значення — кількість таких кораблів

  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      if (field[i][j].state === CellState.occupied) {
        let shipSize = 0;

        // Перевірка на горизонтальне розміщення корабля
        let col = j;
        while (
            col < field[i].length &&
            field[i][col].state === CellState.occupied
            ) {
          shipSize++;
          col++;
        }

        // Якщо корабель не горизонтальний (довжина = 1), перевіряємо вертикальність
        if (shipSize === 1) {
          let row = i;
          while (
              row < field.length &&
              field[row][j].state === CellState.occupied
              ) {
            shipSize++;
            row++;
          }
          shipSize--; // Віднімаємо 1, бо перша клітинка вже врахована
        }

        // Враховуємо корабель тільки, якщо це його "початок" (ліва верхня клітинка)
        if (i === 0 || field[i - 1][j].state !== CellState.occupied) {
          if (j === 0 || field[i][j - 1].state !== CellState.occupied) {
            const currentCount = shipCounts.get(shipSize) || 0;
            shipCounts.set(shipSize, currentCount + 1);
          }
        }
      }
    }
  }

  return shipCounts;
};

// Функція перевіряє, чи відповідає розташування кораблів на полі заданій конфігурації
export const getIsFieldConfigured = (
    field: Field,
    configuration: ShipsConfig
): boolean => {
  const shipCounts = getShipCount(field); // Підрахунок фактичної кількості кораблів на полі

  // Для кожного типу кораблів переконуємося, що в об'єкті є ключ з кількістю (навіть якщо 0)
  configuration.forEach(([deck]) => {
    if (!shipCounts.has(deck)) {
      shipCounts.set(deck, 0);
    }
  });

  // Перевіряємо, чи кількість кожного типу корабля відповідає конфігурації
  return configuration.every(([deck, count]) => shipCounts.get(deck) === count);
};
