// Імпортуємо компонент кнопки
import Button from '@/components/ui/button';

// Імпортуємо тип FC (Functional Component) з React
import { FC } from 'react';

// Тип пропсів — функція, яка запускає процес налаштування (розставлення кораблів)
interface MenuViewProps {
    onStartSetup: () => void;
}

// Компонент MenuView — головне меню гри
const MenuView: FC<MenuViewProps> = ({ onStartSetup }) => {
    return (
        <div className="flex flex-col">

            <h1 className="text-4xl text-center font-bold text-black-900">
                BAD_Ship
            </h1>


            <span className="text-xs max-w-md mt-1 mb-4 text-black-500">
        Вітаю у грі BAD_Ship! Для початку гри натисніть "Почати гру" та
        отримуйте задоволення!
      </span>

            {/* Кнопка для переходу до налаштування поля */}
            <Button onClick={onStartSetup}>Почати нову гру</Button>
        </div>
    );
};

// Експортуємо компонент для використання в App або роутінгу
export default MenuView;
