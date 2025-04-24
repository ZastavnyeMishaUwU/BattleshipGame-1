// Імпортуємо React і тип для функціонального компонента
import React, { FC } from 'react';
// Імпортуємо утиліту для умовного об'єднання класів
import { cn } from '@/lib';
// Імпортуємо типи для ігрового поля та клітинок
import { type Field as TField, type Cell as TCell } from '@/types';
// Імпортуємо хук для доступу до контексту додатку
import { useAppContext } from '@/context/app-context';
// Імпортуємо компонент Cell для відображення окремих клітинок
import Cell from './cell';

// Визначаємо інтерфейс для пропсів компонента Field
interface FieldProps {
  field: TField; // Ігрове поле (двовимірний масив клітинок)
  onCellClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // Обробник кліку по клітинці (опціонально)
  isHidden?: boolean; // Чи поле приховане (наприклад, для поля комп'ютера)
  disabled?: boolean; // Чи поле неактивне
  getCellProps?: (cell: TCell) => {
    // Функція для отримання додаткових пропсів для клітинки (опціонально)
    isDisabled: boolean; // Чи клітинка неактивна
    isPreview: boolean; // Чи клітинка є частиною попереднього перегляду
    isValid: boolean; // Чи розміщення корабля в клітинці є допустимим
  };
}

// Визначаємо функціональний компонент Field для відображення ігрового поля
const Field: FC<FieldProps> = ({
                                 field, // Ігрове поле
                                 onCellClick, // Обробник кліку
                                 isHidden = false, // За замовчуванням поле не приховане
                                 disabled = false, // За замовчуванням поле активне
                                 getCellProps, // Функція для отримання пропсів клітинки
                               }) => {
  // Отримуємо розмір поля з контексту додатку
  const {
    fieldConfig: { fieldSize },
  } = useAppContext();

  // Якщо поле порожнє або не передано, повертаємо null
  if (!field || field.length === 0) {
    return null;
  }

  // Повертаємо розмітку ігрового поля
  return (
      // Контейнер для поля з адаптивними стилями для різних орієнтацій і пристроїв
      <div
          className={cn(
              'flex flex-col justify-center items-center relative', // Базові Flex-стилі
              'portrait:h-[28vh] portrait:w-[28vh] portrait:mb-[15vh]', // Стилі для портретної орієнтації
              'landscape:h-[30vw] landscape:w-[30vw]', // Стилі для ландшафтної орієнтації
              'desktop:h-[30vw] desktop:w-[30vw] desktop:m-[15vw]' // Стилі для десктопів
          )}
      >
        {/* Ітеруємо по рядках поля */}
        {field.map((row, i) => (
            // Контейнер для рядка, стилізований як CSS Grid
            <div
                key={i} // Унікальний ключ для рядка
                style={{
                  gridTemplateColumns: `repeat(${field.length}, 1fr)`, // Визначаємо кількість стовпців
                }}
                className={cn(
                    'grid gap-0 w-full h-[10%] border-0', // Базові стилі Grid
                    `portrait:h-[${fieldSize}%] portrait:w-[${fieldSize}%]`, // Адаптивна висота/ширина для портретної орієнтації
                    `landscape:h-[${fieldSize}%] landscape:w-[${fieldSize}%]` // Адаптивна висота/ширина для ландшафтної орієнтації
                )}
            >
              {/* Ітеруємо по клітинках у рядку */}
              {row.map((cell, j) => {
                // Отримуємо додаткові пропси для клітинки, якщо getCellProps передано
                const props = getCellProps?.(cell) || {};

                // Відображаємо компонент Cell для кожної клітинки
                return (
                    <Cell
                        key={`${i}-${j}`} // Унікальний ключ для клітинки
                        cell={cell} // Передаємо клітинку
                        disabled={disabled} // Передаємо стан неактивності
                        i={i} // Індекс рядка
                        j={j} // Індекс стовпця
                        onCellClick={onCellClick} // Передаємо обробник кліку
                        isHidden={isHidden} // Передаємо стан приховування
                        {...props} // Передаємо додаткові пропси (isDisabled, isPreview, isValid)
                    />
                );
              })}
            </div>
        ))}
      </div>
  );
};

// Експортуємо компонент за замовчуванням
export default Field;