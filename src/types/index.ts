// Опис однієї клітинки поля
export interface Cell {
  row: number;              // Рядок клітинки
  col: number;              // Колонка клітинки
  state: CellState;         // Стан клітинки (порожня, влучання, промах тощо)
}

// Тип для ігрового поля — двовимірний масив клітинок
export type Field = Cell[][];

// Перелік режимів гри
export enum Mode {
  null = 'null',           // Початковий режим, нічого не відбувається
  setting = 'setting',     // Режим розстановки кораблів
  play = 'play',           // Ігровий режим
}

// Перелік можливих станів однієї клітинки
export enum CellState {
  empty = 'empty',         // Порожня клітинка
  occupied = 'occupied',   // Зайнята кораблем
  missed = 'missed',       // Сюди стріляли, але промах
  hit = 'hit',             // Влучання в корабель
}

// Орієнтація корабля
export enum Orientation {
  horizontal = 'horizontal', // Горизонтальне розміщення
  vertical = 'vertical',     // Вертикальне розміщення
}

// Гравець — або користувач, або комп’ютер
export type Player = 'user' | 'computer';

// Переможець — або гравець, або null, якщо гра ще триває
export type Winner = Player | null;

// Конфігурація кораблів у форматі: [кількість палуб, кількість таких кораблів]
export type ShipsConfig = [number, number][];

// Конфігурація поля: містить кораблі та розмір поля
export type FieldConfig = {
  ships: ShipsConfig;      // Масив кораблів
  fieldSize: number;       // Розмір (наприклад, 10 означає 10x10 поле)
};
