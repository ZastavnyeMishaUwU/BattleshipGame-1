// Імпортуємо типи для функціонального компонента та React-елементів
import { FC, ReactNode } from 'react';

// Визначаємо інтерфейс для пропсів компонента Counter
interface CounterProps {
  value: number; // Поточне значення лічильника
  onChange: (value: number) => void; // Функція, яка викликається при зміні значення
  label?: ReactNode; // Опціональна мітка для лічильника (текст, елемент тощо)
}

// Визначаємо функціональний компонент Counter для відображення та керування числовим лічильником
// Параметри: пропси, визначені в CounterProps
const Counter: FC<CounterProps> = ({ value, onChange, label }) => {
  // Повертаємо розмітку лічильника
  return (
      // Контейнер із Flex-стилем для центрування елементів
      <div className="flex flex-col items-center justify-center gap-2">
        {/* Якщо мітка передана, відображаємо її як заголовок */}
        {label && <span className="text-xl font-bold">{label}</span>}

        {/* Контейнер для кнопок і значення лічильника */}
        <div className="flex items-center text-xl font-bold justify-center gap-5">
          {/* Кнопка для зменшення значення */}
          <button
              className="w-10 bg-white rounded border-blue-500 border h-10"
              onClick={() => onChange(value - 1)} // Зменшуємо значення на 1
          >
            -
          </button>
          {/* Відображаємо поточне значення лічильника */}
          <span className="w-10 text-center">{value}</span>
          {/* Кнопка для збільшення значення */}
          <button
              className="w-10 h-10 bg-white rounded border-blue-500 border"
              onClick={() => onChange(value + 1)} // Збільшуємо значення на 1
          >
            +
          </button>
        </div>
      </div>
  );
};

// Експортуємо компонент за замовчуванням
export default Counter;