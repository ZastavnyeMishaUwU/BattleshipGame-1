// Імпортуємо компонент Counter для вибору розміру поля
import Counter from '@/components/ui/counter';
// Імпортуємо тип для функціонального компонента та хук useMemo
import { FC, useMemo } from 'react';
// Імпортуємо компонент Ship для відображення кораблів
import Ship from '../ship';
// Імпортуємо хук для доступу до контексту додатку
import { useAppContext } from '@/context/app-context';
// Імпортуємо компонент Button для кнопки
import Button from '@/components/ui/button';
// Імпортуємо функцію для підрахунку кораблів на полі
import { getShipCount } from '@/views/setup-view/helpers';
// Імпортуємо утиліту для умовного об'єднання класів
import { cn } from '@/lib/cn';
// Імпортуємо тип для орієнтації корабля
import { Orientation } from '@/types';
// Імпортуємо компонент DragOverlay і хук useDndContext із бібліотеки dnd-kit
import { DragOverlay, useDndContext } from '@dnd-kit/core';

// Визначаємо інтерфейс для пропсів компонента SetupSection
interface SetupSectionProps {
    orientation: Orientation; // Поточна орієнтація кораблів
    toggleOrientation: () => void; // Функція для зміни орієнтації
}

// Визначаємо функціональний компонент SetupSection для налаштування гри
const SetupSection: FC<SetupSectionProps> = ({
                                                 orientation, // Орієнтація кораблів
                                                 toggleOrientation, // Функція перемикання орієнтації
                                             }) => {
    // Отримуємо активний елемент drag-and-drop із контексту dnd-kit
    const { active } = useDndContext();

    // Отримуємо конфігурацію поля, функцію зміни розміру поля та поле користувача з контексту
    const { fieldConfig, changeFieldSize, userField } = useAppContext();

    // Мемоїзуємо мапу кількості кораблів на полі, щоб уникнути зайвих обчислень
    const shipCountMap = useMemo(() => getShipCount(userField), [userField]);

    // Повертаємо розмітку секції налаштування
    return (
        // Контейнер із Flex-стилем для розташування елементів
        <div className="flex flex-col gap-2 mb-auto justify-start items-start">
            {/* Відображаємо DragOverlay для активного корабля під час перетягування */}
            {active && active.data.current && (
                <DragOverlay className="opacity-50">
                    <Ship
                        id={`ship`} // Унікальний ID для корабля в overlay
                        size={active?.data.current?.size} // Розмір корабля
                        orientation={active?.data.current?.orientation} // Орієнтація корабля
                    />
                </DragOverlay>
            )}

            {/* Компонент Counter для вибору розміру поля */}
            <Counter
                label="Розмір поля" // Мітка для лічильника
                value={fieldConfig.fieldSize} // Поточний розмір поля
                onChange={value => changeFieldSize(value)} // Обробник зміни розміру
            />

            {/* Секція для відображення кількості та кораблів */}
            <div className="flex flex-col gap-4">
                <span>Кількість кораблів</span>
                {/* Контейнер для кораблів, стилізований залежно від орієнтації */}
                <div
                    className={cn('flex flex-col gap-2', {
                        'flex-row': orientation === Orientation.vertical, // Горизонтальне розташування для вертикальної орієнтації
                    })}
                >
                    {/* Ітеруємо по розмірах кораблів (від 4 до 1) */}
                    {[4, 3, 2, 1].map(size => {
                        // Обчислюємо кількість доступних кораблів даного розміру
                        const availableShips =
                            fieldConfig.ships[4 - size][1] - (shipCountMap.get(size) || 0);

                        return (
                            // Контейнер для корабля та його кількості
                            <div
                                key={size} // Унікальний ключ
                                className={cn('flex items-center gap-2', {
                                    'flex-col': orientation === Orientation.vertical, // Вертикальне розташування для вертикальної орієнтації
                                })}
                            >
                                {/* Відображаємо кількість доступних кораблів */}
                                <span>{availableShips}</span>

                                {/* Компонент Ship для відображення корабля */}
                                <Ship
                                    size={size} // Розмір корабля
                                    draggable={availableShips > 0} // Чи можна перетягувати (якщо є доступні кораблі)
                                    orientation={orientation} // Орієнтація корабля
                                    id={`ship-${size}`} // Унікальний ID
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Кнопка для зміни орієнтації кораблів */}
            <Button onClick={toggleOrientation}>Змінити орієнтацію (Space)</Button>
        </div>
    );
};

// Експортуємо компонент за замовчуванням
export default SetupSection;