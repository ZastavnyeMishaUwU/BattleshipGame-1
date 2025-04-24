// Імпортуємо контекст для перетягування елементів (drag-and-drop) із бібліотеки dnd-kit
import { DndContext } from '@dnd-kit/core';
// Імпортуємо хук для доступу до контексту додатку
import { useAppContext } from '@/context/app-context';
// Імпортуємо тип для орієнтації корабля
import { Orientation } from '@/types';
// Імпортуємо тип для події завершення перетягування
import { DragEndEvent } from '@dnd-kit/core';
// Імпортуємо типи для функціонального компонента React
import { FC, PropsWithChildren } from 'react';

// Визначаємо функціональний компонент ShipDndProvider, який обгортає додаток у контекст перетягування
// Параметр children: дочірні компоненти, які матимуть доступ до функціоналу drag-and-drop
const ShipDndProvider: FC<PropsWithChildren> = ({ children }) => {
  // Отримуємо функцію placeShip із контексту додатку для розміщення корабля
  const { placeShip } = useAppContext();

  // Обробник події завершення перетягування (drag-and-drop)
  // Параметр event: подія завершення перетягування
  const handleDragEnd = (event: DragEndEvent) => {
    // Отримуємо дані про елемент, який перетягували (active), і місце, куди його скинули (over)
    const { over, active } = event;

    // Якщо корабель скинуто на допустиму область (over існує)
    if (over) {
      // Отримуємо розмір і орієнтацію корабля з даних елемента, який перетягували
      const { size, orientation } = active.data.current as {
        size: number;
        orientation: Orientation;
      };
      // Отримуємо координати (рядок і стовпець) із даних області, куди скинули корабель
      const { row, col } = over.data.current as { row: number; col: number };
      // Викликаємо функцію для розміщення корабля на полі
      placeShip(row, col, size, orientation);
    }
  };

  // Повертаємо провайдер контексту drag-and-drop із обробником завершення перетягування
  return <DndContext onDragEnd={handleDragEnd}>{children}</DndContext>;
};

// Експортуємо компонент за замовчуванням
export default ShipDndProvider;