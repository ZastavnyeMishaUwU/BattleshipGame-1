// Імпортуємо типи для клітинок, станів, поля та орієнтації корабля
import { Cell, CellState, Field, Orientation } from '@/types';
// Імпортуємо хук для моніторингу подій drag-and-drop із бібліотеки dnd-kit
import { useDndMonitor } from '@dnd-kit/core';
// Імпортуємо хук useState для керування станом
import { useState } from 'react';
// Імпортуємо функцію для перевірки можливості розміщення корабля
import { canPlaceShip } from '@/components/providers/helpers/field-helpers';

// Визначаємо інтерфейс для даних, які передаються під час перетягування
interface DragData {
  size: number; // Розмір корабля (кількість палуб)
}

// Визначаємо кастомний хук useDragShip для керування перетягуванням кораблів
// Параметри:
// - field: ігрове поле (двовимірний масив клітинок)
// - orientation: орієнтація корабля (горизонтальна чи вертикальна)
// Повертає об'єкт із функцією getCellProps
export const useDragShip = (field: Field, orientation: Orientation) => {
  // Стан для позиції попереднього перегляду корабля (координати)
  const [previewPosition, setPreviewPosition] = useState<{
    row: number;
    col: number;
  } | null>(null);
  // Стан для даних перетягуваного корабля (розмір)
  const [dragData, setDragData] = useState<DragData | null>(null);
  // Стан для відстеження активності перетягування
  const [active, setActive] = useState(false);

  // Використовуємо хук useDndMonitor для моніторингу подій drag-and-drop
  useDndMonitor({
    // Обробник початку перетягування
    onDragStart(event) {
      setActive(true); // Позначуємо, що перетягування активне
      // Зберігаємо дані перетягуваного елемента (розмір корабля)
      setDragData(event.active.data.current as DragData);
    },
    // Обробник руху під час перетягування
    onDragMove(event) {
      // Якщо немає даних про перетягуваний елемент, виходимо
      if (!event.active.data.current) return;

      // Отримуємо ID області, над якою знаходиться елемент
      const droppableId = event.over?.id.toString() || '';
      // Витягуємо координати (рядок і стовпець) із ID (формат: field-droppable-row-col)
      const match = droppableId.match(/field-droppable-(\d+)-(\d+)/);

      // Якщо координати знайдено, оновлюємо позицію попереднього перегляду
      if (match) {
        const [, row, col] = match;
        setPreviewPosition({ row: parseInt(row), col: parseInt(col) });
      }

      // Оновлюємо дані перетягуваного елемента
      setDragData(event.active.data.current as DragData);
    },
    // Обробник завершення перетягування
    onDragEnd() {
      setActive(false); // Деактивуємо перетягування
      setPreviewPosition(null); // Очищаємо позицію попереднього перегляду
      setDragData(null); // Очищаємо дані корабля
    },
    // Обробник скасування перетягування
    onDragCancel() {
      setActive(false); // Деактивуємо перетягування
      setPreviewPosition(null); // Очищаємо позицію попереднього перегляду
      setDragData(null); // Очищаємо дані корабля
    },
  });

  // Функція перевіряє, чи клітинка є частиною попереднього перегляду корабля
  // Параметри row, col: координати клітинки
  // Повертає boolean: true, якщо клітинка є частиною попереднього перегляду
  const isPartOfPreview = (row: number, col: number): boolean => {
    // Якщо немає позиції, даних або перетягування неактивне, повертаємо false
    if (!previewPosition || !dragData || !active) return false;

    const { size } = dragData; // Отримуємо розмір корабля
    const { row: startRow, col: startCol } = previewPosition; // Початкові координати

    // Перевіряємо залежно від орієнтації корабля
    if (orientation === Orientation.horizontal) {
      // Для горизонтальної орієнтації: той самий рядок, стовпці в межах розміру
      return row === startRow && col >= startCol && col < startCol + size;
    } else {
      // Для вертикальної орієнтації: той самий стовпець, рядки в межах розміру
      return col === startCol && row >= startRow && row < startRow + size;
    }
  };

  // Функція повертає пропси для клітинки (для відображення стану)
  // Параметр cell: клітинка, для якої визначаються пропси
  // Повертає об'єкт із властивостями isDisabled, isPreview, isValid
  const getCellProps = (cell: Cell) => {
    // Клітинка неактивна, якщо її стан missed або hit
    const isDisabled = [CellState.missed, CellState.hit].includes(cell.state);

    // Перевіряємо, чи клітинка є частиною попереднього перегляду
    const isPreview = isPartOfPreview(cell.row, cell.col);
    // Перевіряємо, чи розміщення корабля в позиції попереднього перегляду є можливим
    const isValid =
        isPreview && dragData && previewPosition
            ? canPlaceShip(
                field,
                previewPosition.row,
                previewPosition.col,
                dragData.size,
                orientation
            )
            : true;

    return {
      isDisabled, // Чи клітинка неактивна
      isPreview, // Чи клітинка є частиною попереднього перегляду
      isValid, // Чи розміщення корабля є можливим
    };
  };

  // Повертаємо об'єкт із функцією для отримання пропсів клітинок
  return {
    getCellProps,
  };
};