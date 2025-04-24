// Імпортуємо контекст додатку для передачі стану та функцій дочірнім компонентам
import { AppContext } from '@/context/app-context';
// Імпортуємо константи за замовчуванням і утиліту для затримки
import { DEFAULT_SHIPS_CONFIG, DEFAULT_FIELD_SIZE, sleep } from '@/lib';
// Імпортуємо типи для конфігурації поля, гравця, переможця, поля, клітинок та орієнтації
import {
  FieldConfig,
  Player,
  Winner,
  Field,
  Cell,
  CellState,
  Orientation,
} from '@/types';
// Імпортуємо React-хуки та типи для функціонального компонента
import { FC, PropsWithChildren, useState, useMemo } from 'react';
// Імпортуємо допоміжні функції для роботи з полем і клітинками
import {
  initializeEmptyField,
  getShipCells,
  checkIsShipDestroyed,
  markMissedAdjacentCells,
  checkOccupiedCells,
  getAiShot,
  generateShips,
  canPlaceShip,
} from './helpers';

// Визначаємо функціональний компонент AppProvider, який обгортає додаток у контекст
// Параметр children: дочірні компоненти, які отримають доступ до контексту
const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  // Стан для конфігурації поля (розмір і кораблі)
  const [fieldConfig, setFieldConfig] = useState<FieldConfig>({
    ships: DEFAULT_SHIPS_CONFIG, // Конфігурація кораблів за замовчуванням
    fieldSize: DEFAULT_FIELD_SIZE, // Розмір поля за замовчуванням
  });

  // Мемоїзоване початкове порожнє поле, яке залежить від розміру поля
  const initialField = useMemo(
      () => initializeEmptyField(fieldConfig.fieldSize),
      [fieldConfig.fieldSize]
  );

  // Стан для поточного гравця (користувач або комп'ютер)
  const [currentPlayer, setCurrentPlayer] = useState<Player>('user');
  // Стан для зберігання переможця гри (або null, якщо гра триває)
  const [winner, setWinner] = useState<Winner>(null);
  // Стан для поля користувача
  const [userField, setUserField] = useState<Field>(initialField);
  // Стан для поля комп'ютера
  const [computerField, setComputerField] = useState<Field>(initialField);

  // Функція оновлює стан клітинки залежно від її поточного стану
  // Параметри:
  // - cell: клітинка, яку потрібно оновити
  // - field: поле, в якому відбувається оновлення
  const updateCellMode = (cell: Cell, field: Field) => {
    // Змінюємо стан клітинки залежно від її поточного стану
    switch (cell.state) {
      case CellState.empty:
        field[cell.row][cell.col].state = CellState.missed; // Порожня клітинка стає промахом
        break;
      case CellState.occupied:
        field[cell.row][cell.col].state = CellState.hit; // Зайнята клітинка стає пошкодженою
        break;
      default:
        break;
    }

    // Оновлюємо відповідне поле в стані
    if (field === userField) setUserField([...field]);
    else setComputerField([...field]);
  };

  // Функція реалізує атаку комп'ютера
  // Параметр shot: клітинка, в яку стріляє комп'ютер
  const computerAttack = async (shot: Cell) => {
    // Затримка для імітації "обдумування" комп'ютера
    await sleep(500);

    // Оновлюємо стан клітинки на полі користувача
    updateCellMode(shot, userField);

    // Знаходимо всі клітинки корабля, до якого належить ця клітинка
    const ship = getShipCells(shot, userField);

    // Перевіряємо, чи корабель знищено
    const isShipDestroyed = checkIsShipDestroyed(ship);

    // Якщо корабель знищено, позначаємо сусідні клітинки як промах
    if (isShipDestroyed) {
      markMissedAdjacentCells(ship, userField);
    }

    // Перевіряємо, чи залишилися на полі користувача зайняті клітинки
    const isSomeUserShipsAlive = checkOccupiedCells(userField);

    // Якщо кораблів не залишилося, комп'ютер перемагає
    if (!isSomeUserShipsAlive) {
      setWinner('computer');
      return;
    }

    // Якщо постріл був влучним, комп'ютер стріляє ще раз
    if (userField[shot.row][shot.col].state === CellState.hit) {
      const shot = getAiShot(userField);
      await sleep(2000); // Додаткова затримка перед наступним пострілом
      computerAttack(shot);
    } else {
      // Якщо промах, хід передається користувачу
      setCurrentPlayer('user');
    }
  };

  // Обробник кліку по полю комп'ютера (хід користувача)
  // Параметр event: подія кліку на кнопці
  const onComputerFieldClick = async (
      event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const target = event.target as HTMLButtonElement;
    // Отримуємо індекси рядка і стовпця з data-атрибутів
    const rowIndex = parseInt(target.dataset.rowIndex!);
    const columnIndex = parseInt(target.dataset.columnIndex!);

    // Отримуємо клітинку, в яку клікнув користувач
    const cell = computerField[rowIndex][columnIndex];

    // Оновлюємо стан клітинки на полі комп'ютера
    updateCellMode(cell, computerField);

    // Знаходимо клітинки корабля, до якого належить клітинка
    const ship = getShipCells(cell, computerField);

    // Перевіряємо, чи корабель знищено
    const isShipDestroyed = checkIsShipDestroyed(ship);
    if (isShipDestroyed) {
      // Якщо знищено, позначаємо сусідні клітинки як промах
      markMissedAdjacentCells(ship, computerField);
    }

    // Перевіряємо, чи залишилися на полі комп'ютера зайняті клітинки
    const isSomeComputerShipsAlive = checkOccupiedCells(computerField);

    // Якщо кораблів не залишилося, користувач перемагає
    if (!isSomeComputerShipsAlive) {
      setWinner('user');
      return;
    }

    // Якщо постріл був промахом, комп'ютер робить хід
    if (cell.state === CellState.missed) {
      setCurrentPlayer('computer');
      const shot = getAiShot(userField);
      await computerAttack(shot);
    }
  };

  // Функція генерує випадкове розташування кораблів для поля користувача
  const generateRandomPlayerField = () => {
    const shipPlacement = generateShips(fieldConfig);
    setUserField(shipPlacement);
  };

  // Функція генерує випадкове розташування кораблів для поля комп'ютера
  const generateRandomComputerField = () => {
    const shipPlacement = generateShips(fieldConfig);
    setComputerField(shipPlacement);
  };

  // Функція змінює розмір поля
  // Параметр size: новий розмір поля
  const changeFieldSize = (size: number) => {
    // Забороняємо розмір менший за 10
    if (size < 10) return setFieldConfig({ ...fieldConfig, fieldSize: 10 });
    setFieldConfig({ ...fieldConfig, fieldSize: size });
    // Оновлюємо поля користувача і комп'ютера
    setUserField(initializeEmptyField(size));
    setComputerField(initializeEmptyField(size));
  };

  // Функція очищає поле користувача, скидаючи його до порожнього стану
  const clearUserField = () => {
    const resetField = initializeEmptyField(fieldConfig.fieldSize);
    setUserField(resetField);
  };

  // Функція скидає гру до початкового стану
  const resetGame = () => {
    const resetField = initializeEmptyField(DEFAULT_FIELD_SIZE);
    setUserField(resetField);
    setComputerField(resetField);
    setWinner(null);
    setCurrentPlayer('user');
    setFieldConfig({ ...fieldConfig, fieldSize: DEFAULT_FIELD_SIZE });
  };

  // Функція розміщує корабель на полі користувача
  // Параметри:
  // - row, col: початкові координати
  // - size: розмір корабля (кількість палуб)
  // - orientation: орієнтація корабля
  const placeShip = (
      row: number,
      col: number,
      size: number,
      orientation: Orientation
  ) => {
    // Перевіряємо, чи можна розмістити корабель
    if (!canPlaceShip(userField, row, col, size, orientation)) return;

    // Створюємо копію поля
    const newField = [...userField];
    // Розміщуємо корабель, змінюючи стани клітинок
    for (let i = 0; i < size; i++) {
      const newRow = orientation === Orientation.vertical ? row + i : row;
      const newCol = orientation === Orientation.horizontal ? col + i : col;
      newField[newRow][newCol].state = CellState.occupied;
    }

    // Оновлюємо поле користувача
    setUserField(newField);
  };

  // Функція видаляє корабель із поля користувача
  // Параметри row, col: координати клітинки корабля
  const deleteShip = (row: number, col: number) => {
    const newField = [...userField];
    // Знаходимо всі клітинки корабля
    const ship = getShipCells(newField[row][col], newField);
    // Очищаємо стани клітинок (змінюємо на empty)
    ship.forEach(cell => {
      newField[cell.row][cell.col].state = CellState.empty;
    });
    // Оновлюємо поле користувача
    setUserField(newField);
  };

  // Повертаємо провайдер контексту з усіма значеннями та функціями
  return (
      <AppContext.Provider
          value={{
            currentPlayer,
            winner,
            userField,
            computerField,
            fieldConfig,
            changeFieldSize,
            resetGame,
            generateRandomPlayerField,
            generateRandomComputerField,
            clearUserField,
            onComputerFieldClick,
            placeShip,
            deleteShip,
          }}
      >
        {children}
      </AppContext.Provider>
  );
};

// Експортуємо компонент за замовчуванням
export default AppProvider;