// Імпортуємо кнопку з UI-бібліотеки
import Button from '@/components/ui/button';

// Імпортуємо компонент поля для гри
import Field from '@/components/widgets/field';

// Імпортуємо кастомний хук для доступу до контексту гри
import { useAppContext } from '@/context/app-context/use-app-context';

// Імпортуємо тип FC для функціонального компоненту
import { FC } from 'react';

// Тип пропсів — функція завершення гри
interface GameViewProps {
    onEndGame: () => void;
}

// Головний компонент гри — відображає поле користувача і поле комп’ютера
const GameView: FC<GameViewProps> = ({ onEndGame }) => {
    // Деструктуризуємо значення з контексту гри
    const { currentPlayer, userField, computerField, onComputerFieldClick } =
        useAppContext();

    return (
        <div className="flex flex-col text-center items-center justify-center">
            {/* Інформація, чий зараз хід */}
            <span className="text-3xl">
        {currentPlayer === 'user' ? 'Ваш хід' : "Ходить Комп'ютер"}
      </span>

            {/* Поля гравців: ліворуч — користувач, праворуч — комп'ютер */}
            <div className="flex justify-around items-center m-auto w-full h-auto text-blue-900 md:landscape:flex-row md:landscape:w-[70vw] md:portrait:flex-col md:portrait:h-[70vh]">
                <div>
                    <h2 className="m-0 text-[5vh] font-bold text-fuchsia-800">Ваше поле</h2>
                    {/* Поле користувача: показується повністю, кліки вимкнені */}
                    <Field field={userField} isHidden={false} disabled />
                </div>
                <div>
                    <h2 className="m-0 text-[5vh] font-bold text-fuchsia-800">Комп'ютер</h2>
                    {/* Поле комп’ютера: приховані кораблі, кліки активні тільки коли хід користувача */}
                    <Field
                        field={computerField}
                        onCellClick={onComputerFieldClick}
                        isHidden
                        disabled={currentPlayer === 'computer'}
                    />
                </div>
            </div>

            {/* Кнопка завершення гри */}
            <div className="mt-4 w-fit">
                <Button onClick={onEndGame}>Завершити гру</Button>
            </div>
        </div>
    );
};

// Експортуємо компонент для використання в маршрутах або App.tsx
export default GameView;
