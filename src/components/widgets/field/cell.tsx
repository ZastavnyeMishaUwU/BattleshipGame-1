// Імпортуємо хук для доступу до контексту додатку
import { useAppContext } from '@/context/app-context';
// Імпортуємо утиліту для умовного об'єднання класів
import { cn } from '@/lib';
// Імпортуємо типи для станів клітинок і клітинок
import { CellState, type Cell } from '@/types';
// Імпортуємо хук для створення droppable-елемента з бібліотеки dnd-kit
import { useDroppable } from '@dnd-kit/core';
// Імпортуємо тип для функціонального компонента
import { FC } from 'react';

// Визначаємо інтерфейс для пропсів компонента Cell
interface CellProps {
    cell: Cell; // Клітинка з інформацією про стан і координати
    disabled?: boolean; // Чи клітинка неактивна (опціонально)
    i: number; // Індекс рядка клітинки
    j: number; // Індекс стовпця клітинки
    isValid?: boolean; // Чи є розміщення корабля в цій клітинці допустимим (для попереднього перегляду)
    isPreview?: boolean; // Чи клітинка є частиною попереднього перегляду корабля
    isHidden: boolean; // Чи клітинка прихована (наприклад, для поля комп'ютера)
    onCellClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // Обробник кліку по клітинці (опціонально)
}

// Визначаємо функціональний компонент Cell для відображення однієї клітинки ігрового поля
const Cell: FC<CellProps> = ({
                                 cell, // Клітинка
                                 disabled, // Стан неактивності
                                 i, // Рядок
                                 j, // Стовпець
                                 isValid, // Валідність розміщення
                                 isPreview, // Попередній перегляд
                                 isHidden, // Прихованість
                                 onCellClick, // Обробник кліку
                             }) => {
    // Отримуємо функцію deleteShip із контексту для видалення корабля
    const { deleteShip } = useAppContext();

    // Використовуємо хук useDroppable для створення droppable-елемента (для drag-and-drop)
    const { setNodeRef } = useDroppable({
        id: `field-droppable-${i}-${j}`, // Унікальний ID для droppable-елемента
        disabled, // Чи елемент неактивний для перетягування
        data: { row: i, col: j }, // Дані, які передаються при скиданні (координати)
    });

    // Повертаємо кнопку, яка представляє клітинку ігрового поля
    return (
        <button
            ref={setNodeRef} // Прив'язуємо елемент до droppable
            onDoubleClick={() => deleteShip(i, j)} // Подвійний клік викликає видалення корабля
            // Використовуємо утиліту cn для умовного об'єднання класів стилів
            className={cn(
                // Базові стилі: межа, ефект переходу, ховер-ефект, стиль для неактивного стану
                'relative border border-blue-900 transition-all duration-500 ease-in-out hover:transform disabled:cursor-not-allowed',
                {
                    // Стилі для різних станів клітинки
                    'bg-blue-900': cell.state === CellState.occupied, // Зайнята клітинка (корабель)
                    // Стиль для промаху: жовтий фон із чорною точкою
                    "bg-yellow-300 after:content-[''] after:absolute after:w-[2px] after:h-[2px] after:bg-black after:rounded-full after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2":
                        cell.state === CellState.missed,
                    // Стиль для влучання: червоний фон із хрестиком
                    "bg-red-500 before:content-[''] before:absolute before:w-full before:h-[0.1px] before:bg-[rgb(97,97,97)] before:top-1/2 before:left-0 before:rotate-45 after:content-[''] after:absolute after:w-full after:h-[0.1px] after:bg-[rgb(97,97,97)] after:top-1/2 after:right-0 after:-rotate-45":
                        cell.state === CellState.hit,
                    // Білий фон для порожньої клітинки або прихованої зайнятої клітинки
                    'bg-white':
                        !isPreview &&
                        (cell.state === CellState.empty ||
                            (isHidden && cell.state === CellState.occupied)),
                },
                // Стилі для drag-and-drop (попередній перегляд)
                {
                    'bg-blue-500': isPreview && isValid, // Синій фон для валідного попереднього перегляду
                    'bg-red-500': isPreview && !isValid, // Червоний фон для невалідного попереднього перегляду
                }
            )}
            data-row-index={i} // Додаємо data-атрибут для рядка
            data-column-index={j} // Додаємо data-атрибут для стовпця
            onClick={onCellClick} // Передаємо обробник кліку
            disabled={disabled} // Передаємо стан неактивності
        />
    );
};

// Експортуємо компонент за замовчуванням
export default Cell;