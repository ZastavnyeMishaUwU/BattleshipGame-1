// Імпортуємо необхідні залежності
import { FC } from 'react'; // Тип для функціонального компоненту
import { cn } from '@/lib'; // Утиліта для поєднання класів (classNames)
import { useDraggable } from '@dnd-kit/core'; // Хук для drag-and-drop функціоналу
import { Orientation } from '@/types'; // Тип орієнтації корабля

// Типізація пропсів компонента Ship
interface ShipProps {
    size: number;             // Кількість блоків (довжина корабля)
    draggable?: boolean;      // Чи можна перетягувати корабель
    orientation?: Orientation;// Орієнтація корабля: горизонтальна або вертикальна
    id: string;               // Унікальний ідентифікатор (потрібен для drag-and-drop)
}

// Компонент Ship — візуалізує корабель, який можна перетягувати
const Ship: FC<ShipProps> = ({
                                 size,
                                 draggable = false, // За замовчуванням перетягування вимкнене
                                 orientation = Orientation.horizontal, // За замовчуванням горизонтальна орієнтація
                                 id,
                             }) => {
    // Ініціалізація можливості перетягування через useDraggable
    const { attributes, listeners, active, setNodeRef } = useDraggable({
        id, // Унікальний ідентифікатор
        data: { size, orientation }, // Додаткова інформація для обробника drag-and-drop
        disabled: !draggable, // Вимикаємо, якщо draggable = false
    });

    return (
        <div
            ref={setNodeRef} // Прив’язуємо DOM-елемент до drag-and-drop системи
            className={cn('flex flex-nowrap', {
                'items-center': orientation === Orientation.horizontal, // Горизонтальний — в ряд
                'flex-col': orientation === Orientation.vertical,       // Вертикальний — в колонку
                'cursor-move': draggable,      // Вказівник миші як "рука", якщо перетягування увімкнено
                'opacity-50': active,          // Напівпрозорість при активному перетягуванні
            })}
            {...attributes} // Атрибути для drag-and-drop
            {...listeners}  // Обробники подій drag-and-drop
        >
            {/* Візуалізуємо кожен блок корабля */}
            {Array.from({ length: size }).map((_, index) => (
                <div
                    key={index}
                    className={cn(
                        'bg-blue-900 border border-blue-900 flex items-center justify-center', // Стилі одного сегмента корабля
                        'portrait:h-[2.8vh] portrait:w-[2.8vh]',   // Розміри для портретної орієнтації
                        'landscape:h-[3vw] landscape:w-[3vw]',     // Розміри для альбомної орієнтації
                        'desktop:h-[3vw] desktop:w-[3vw]'          // Розміри для десктопу
                    )}
                />
            ))}
        </div>
    );
};

// Експортуємо компонент для подальшого використання
export default Ship;
