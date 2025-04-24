// Імпортуємо кнопку — кастомний UI-компонент
import Button from '@/components/ui/button';

// Імпортуємо кастомний хук для доступу до контексту гри
import { useAppContext } from '@/context/app-context';

// Імпортуємо функцію перевірки правильності розміщення кораблів
import { getIsFieldConfigured } from '@/views/setup-view/helpers';

// React і хуки
import { FC, useMemo } from 'react';

// Секція з переліком кораблів та перемикачем орієнтації
import SetupSection from '@/components/widgets/setup-section/setup-section';

// Компонент поля гри
import Field from '@/components/widgets/field';

// Хук для обробки drag-n-drop кораблів
import { useDragShip } from '@/components/widgets/field/hooks/use-drag-ship';

// Хук для зміни орієнтації кораблів (горизонтальна / вертикальна)
import { useOrientation } from '@/components/widgets/setup-section/hooks/use-orientation';

// Пропси компонента — лише функція запуску гри
interface SetupViewProps {
    onStartGame: () => void;
}

// Основний компонент SetupView — відображає інтерфейс розстановки кораблів
const SetupView: FC<SetupViewProps> = ({ onStartGame }) => {
    // Отримуємо потрібні дані з контексту гри
    const { userField, generateRandomPlayerField, fieldConfig, clearUserField } =
        useAppContext();

    // Отримуємо поточну орієнтацію (горизонтальна / вертикальна) та функцію для її зміни
    const { orientation, toggleOrientation } = useOrientation();

    // Отримуємо обробники для кожної клітинки поля — для підтримки drag-n-drop
    const { getCellProps } = useDragShip(userField, orientation);

    // Визначаємо, чи всі кораблі розставлені згідно з конфігурацією
    const isPlayerFieldReady = useMemo(
        () => getIsFieldConfigured(userField, fieldConfig.ships),
        [fieldConfig.ships, userField]
    );

    return (
        <div className="flex flex-col w-full items-center justify-center gap-2">
            <h1 className="text-4xl font-bold text-yellow-900">Налаштування</h1>

            <span className="text-xs text-center max-w-md mt-1 mb-4 text-black-500">
        Перетягніть кораблі на поле або натисніть "Розставити" для випадкового
        розміщення. Натисніть пробіл для зміни орієнтації корабля. Натисніть
        "Погнали" для початку гри
      </span>

            {/* Основна зона з полем та списком кораблів */}
            <div className="flex w-full flex-col md:flex-row max-w-5xl gap-5 justify-center items-center">
                <SetupSection
                    orientation={orientation}
                    toggleOrientation={toggleOrientation}
                />
                <Field field={userField} getCellProps={getCellProps} />
            </div>

            {/* Кнопки керування під полем */}
            <div className="mt-4 flex gap-2">
                <Button onClick={clearUserField}>Очистити</Button>
                <Button onClick={generateRandomPlayerField}>Розставити</Button>
                <Button onClick={onStartGame} disabled={!isPlayerFieldReady}>
                    Погнали
                </Button>
            </div>
        </div>
    );
};

// Експортуємо компонент для використання в головному екрані
export default SetupView;
